import userService from "../../../identity/services/user.service.js";
import { HTTP_STATUS } from "../../../../utils/constants.js";

/**
 * Administration User Management Controller
 * Handles admin operations for user management
 */

/**
 * Assign role to user by email
 * Creates account if user doesn't exist, sends email with credentials
 */
export const assignRoleToUser = async (req, res, next) => {
  try {
    const { email, full_name, role } = req.body;
    const adminId = req.user?.user_id || "ADMIN";

    const result = await userService.createUser(
      { email, full_name, role },
      adminId
    );

    const statusCode = result.is_existing_user
      ? HTTP_STATUS.OK
      : HTTP_STATUS.CREATED;

    const message = result.role_already_existed
      ? "User already has this role"
      : result.is_existing_user
      ? "Role added to existing user"
      : "User created and role assigned successfully. Welcome email sent.";

    res.status(statusCode).json({
      success: true,
      data: result,
      message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users with their assigned roles
 */
export const getAllUsersWithRoles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await userService.getAllUsersWithRoles(page, limit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by identifier (email, id, or ssomail)
 * For searching before editing
 */
export const getUserByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    const user = await userService.getUserByIdentifier(identifier);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Edit user by finding via id/email/ssomail
 * Updates user name and/or roles (multiple roles supported)
 */
export const editUser = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const { full_name, roles, role } = req.body; // Accept both roles array and single role
    const adminId = req.user?.user_id || "ADMIN";

    const updatedUser = await userService.updateUser(
      identifier,
      { full_name, roles: roles || (role ? [role] : undefined) }, // Convert single role to array if needed
      adminId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Suspend user by id or email
 */
export const suspendUser = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    const adminId = req.user?.user_id || "ADMIN";

    const suspendedUser = await userService.suspendUser(identifier, adminId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: suspendedUser,
      message: "User suspended successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unsuspend user by id or email (reactivate)
 */
export const unsuspendUser = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    const adminId = req.user?.user_id || "ADMIN";

    const unsuspendedUser = await userService.unsuspendUser(
      identifier,
      adminId
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: unsuspendedUser,
      message: "User unsuspended successfully",
    });
  } catch (error) {
    next(error);
  }
};
