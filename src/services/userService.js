import userRepository from "../repositories/userRepository.js";
import emailService from "./emailService.js";
import { generateRandomPassword } from "../utils/passwordGenerator.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import { HTTP_STATUS } from "../utils/constants.js";

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
          id: existingUser._id,
          _id: existingUser._id,
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
        id: existingUser._id,
        _id: existingUser._id,
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

    // 6. Send Email (Async, don't await blocking logic flow if email fails, but in userService we usually want to know.
    // For now, fire and forget or catch error to not fail user creation?
    // Let's await it to ensure they get credentials, or handle error gracefully)
    // 6. Send Email
    try {
      console.log(`[UserService] Sending welcome email to: ${newUser.email}`);
      await emailService.sendWelcomeEmail(
        newUser.email,
        password,
        newUser.full_name
      );
      console.log(`[UserService] Welcome email sent successfully.`);
    } catch (err) {
      console.error(
        `[UserService] Failed to send welcome email to ${newUser.email}`,
        err
      );
      // We still return user, but maybe warn?
    }

    return {
      id: newUser._id,
      _id: newUser._id,
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
}

export default new UserService();
