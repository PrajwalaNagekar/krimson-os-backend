import userRepository from "../repositories/user.repository.js";
import { generateRandomPassword } from "../../../utils/passwordGenerator.js";
import AppError from "../../../core/errors/app.error.js";
import bcrypt from "bcryptjs";
import { HTTP_STATUS } from "../../../utils/constants.js";
import emailService from "../../../services/emailService.js";

/**
 * Service to handle User Management logic.
 */
class UserService {
  /**
   * Create a new user (Admin function).
   * @param {Object} data - User data (name, email, role, etc.)
   * @param {string} adminId - ID of admin creating the user
   * @returns {Promise<Object>} - Created user info
   */
  async createUser(data, adminId) {
    // 1. Check if user exists
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      // Check if multiple roles logic matches
      // Ensure roles array is populated from current state if empty
      if (!existingUser.roles || existingUser.roles.length === 0) {
        // Default to active_role if available, else empty
        existingUser.roles = existingUser.active_role
          ? [existingUser.active_role]
          : [];
      }

      // Check if role already assigned
      if (existingUser.roles.includes(data.role)) {
        // User already has this role; return existing user info without error (Idempotent)
        console.log(
          `[UserService] User ${data.email} already has role ${data.role}. Skipping addition.`
        );
        return {
          user_id: existingUser.user_id,
          full_name: existingUser.full_name,
          email: existingUser.email,
          role: existingUser.active_role,
          active_role: existingUser.active_role,
          roles: existingUser.roles,
          is_existing_user: true,
          role_already_existed: true,
        };
      }

      // Add new role
      existingUser.roles.push(data.role);
      await existingUser.save({ validateBeforeSave: false });

      console.log(
        `[UserService] Added role ${data.role} to existing user ${existingUser.email}`
      );

      return {
        user_id: existingUser.user_id,
        full_name: existingUser.full_name,
        email: existingUser.email,
        role: existingUser.active_role, // Keeps primary role
        active_role: existingUser.active_role,
        roles: existingUser.roles,
        is_existing_user: true,
      };
    }

    // 2. Generate Password
    const password = generateRandomPassword();

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User Payload
    // Ensure roles array is populated
    const roles = data.roles || [data.role];

    const userPayload = {
      ...data,
      password_hash: hashedPassword,
      roles: roles,
      active_role: data.role, // Set initial active_role
      created_by: adminId || "SYSTEM",
    };

    // 5. Save to DB
    const newUser = await userRepository.create(userPayload);

    // 6. Send Email
    try {
      console.log(`[UserService] User created: ${newUser.email}`);
      await emailService.sendWelcomeEmail(
        newUser.email,
        password,
        newUser.full_name
      );
      console.log(`[UserService] Welcome email sent to ${newUser.email}`);
    } catch (err) {
      console.error(
        `[UserService] Failed to send welcome email to ${newUser.email}`,
        err
      );
      // Don't fail user creation if email fails
    }

    return {
      user_id: newUser.user_id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.active_role,
      active_role: newUser.active_role,
      created_at: newUser.created_at,
    };
  }

  /**
   * Get all users.
   * @returns {Promise<Array>}
   */
  async getAllUsers(page = 1, limit = 10) {
    const { users, total } = await userRepository.findAll(page, limit);

    return {
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all users with role information.
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Users with roles
   */
  async getAllUsersWithRoles(page = 1, limit = 10) {
    const { users, total } = await userRepository.findAllWithRoles(page, limit);

    return {
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get user by identifier (email, user_id, or sso_provider).
   * @param {string} identifier - Email, user_id, or sso_provider
   * @returns {Promise<Object>} User object
   */
  async getUserByIdentifier(identifier) {
    const user = await userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }
    return user;
  }

  /**
   * Update user information (name and/or roles).
   * @param {string} identifier - Email, user_id, or sso_provider
   * @param {Object} updateData - Data to update (full_name, roles)
   * @param {string} adminId - ID of admin making the update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(identifier, updateData, adminId) {
    // Find user first
    const user = await userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    const updates = { updated_by: adminId };

    // Update full name if provided
    if (updateData.full_name) {
      updates.full_name = updateData.full_name;
    }

    // Update roles if provided (array of selected roles)
    if (updateData.roles && Array.isArray(updateData.roles)) {
      // Set the new roles array
      updates.roles = updateData.roles;

      // Set active_role to first role in the array, or keep existing if no roles
      if (updateData.roles.length > 0) {
        // Keep current active_role if it's still in the new roles array
        if (user.active_role && updateData.roles.includes(user.active_role)) {
          updates.active_role = user.active_role;
        } else {
          // Otherwise, set to first role in the new array
          updates.active_role = updateData.roles[0];
        }
      }
    }

    // Legacy support: Update single role if provided (for backward compatibility)
    if (updateData.role && !updateData.roles) {
      // Update active_role
      updates.active_role = updateData.role;

      // Ensure role is in roles array
      if (!user.roles.includes(updateData.role)) {
        updates.roles = [...user.roles, updateData.role];
      }
    }

    const updatedUser = await userRepository.update(user.user_id, updates);
    return updatedUser;
  }

  /**
   * Suspend user account
   * @param {string} identifier - Email or user_id
   * @param {string} adminId - ID of admin performing suspension
   * @returns {Promise<Object>} Suspended user
   */
  async suspendUser(identifier, adminId) {
    const user = await userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    if (user.status === "suspended") {
      throw new AppError("User is already suspended", HTTP_STATUS.BAD_REQUEST);
    }

    const suspendedUser = await userRepository.updateStatus(
      user.user_id,
      "suspended",
      adminId
    );
    return suspendedUser;
  }

  /**
   * Unsuspend user account (reactivate)
   * @param {string} identifier - Email or user_id
   * @param {string} adminId - ID of admin performing unsuspension
   * @returns {Promise<Object>} Unsuspended user
   */
  async unsuspendUser(identifier, adminId) {
    const user = await userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    if (user.status !== "suspended") {
      throw new AppError("User is not suspended", HTTP_STATUS.BAD_REQUEST);
    }

    const unsuspendedUser = await userRepository.updateStatus(
      user.user_id,
      "active",
      adminId
    );
    return unsuspendedUser;
  }
}

export default new UserService();
