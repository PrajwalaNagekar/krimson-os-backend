import userRepository from "../repositories/user.repository.js";
import AppError from "../../../core/errors/app.error.js";
import { HTTP_STATUS } from "../../../utils/constants.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../../utils/tokens.js";
import { generateOTP } from "../../../utils/otp.js";
import emailService from "../../../services/emailService.js";



/**
 * Service to handle Authentication logic.
 * Follows the Singleton pattern.
 */
class AuthService {
  /**
   * Authenticate a user.
   * @param {string} email - User's email
   * @param {string} password - User's plain text password
   * @returns {Promise<Object>} - Object containing user info and JWT token
   */
  async login(email, password) {
    // 1. Check if user exists
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Use generic error message for security (prevent enumeration)
      throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
    }

    // 2. data-integrity check: Ensure user has a password hash
    if (!user.password_hash) {
      console.error(`[AuthError] User ${user.user_id} has no password hash.`);
      throw new AppError(
        "Login not allowed. Please reset your password.",
        HTTP_STATUS.FORBIDDEN
      );
    }

    // 3. Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
    }

    // 4. Determine Roles & Generate Token
    // 4. Determine Roles & Generate Token
    // Backward compatibility: ensure 'roles' array is populated
    let roles = user.roles;
    if (!roles || roles.length === 0) {
      // If roles is empty, try to use active_role if it exists, otherwise default
      roles = user.active_role ? [user.active_role] : [];
    }

    // Use the primary role (user.active_role) as the 'active' role for this session
    // If active_role is not set, default to first available role or fallback
    let activeRole = user.active_role;
    if (!activeRole && roles.length > 0) {
      activeRole = roles[0];
      // Optionally update the user's active_role in DB?
      // user.active_role = activeRole;
      // await user.save({ validateBeforeSave: false });
    }

    const payload = { id: user._id, role: activeRole, roles: roles };
    const accessToken = generateAccessToken(payload);
    console.log("access", accessToken);
    const refreshToken = generateRefreshToken({ id: user._id });
    console.log("refresh", refreshToken);

    // Store refresh token in DB
    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });
    console.log("access", accessToken);

    return {
      user: {
        _id: user._id,
        name: user.full_name,
        email: user.email,
        role: activeRole,
        active_role: activeRole,
        roles: roles,
      },
      accessToken,
      refreshToken,
    };


  }

  /**
   * Send OTP for password reset (replaces token-based system).
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async sendPasswordResetOTP(email) {
    console.log("email", email);
    // 1. Get user based on email
    const user = await userRepository.findByEmail(email);
    console.log("user", user);
    if (!user) {
      throw new AppError(
        "There is no user with that email address.",
        HTTP_STATUS.NOT_FOUND
      );
    }

    // 2. Generate secure 6-digit OTP
    const otp = generateOTP();

    // 3. Hash OTP and store in DB with 24-hour expiry
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.passwordResetOTP = hashedOTP;
    user.passwordResetOTPExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    user.passwordResetOTPVerified = false;

    await user.save({ validateBeforeSave: false });

    try {
      // 4. Send OTP via email service
      await emailService.sendPasswordResetOTP(user.email, otp);

      return { message: "An OTP has been sent to your email address." };

    } catch (err) {
      // Clean up fields if email fails
      user.passwordResetOTP = undefined;
      user.passwordResetOTPExpire = undefined;
      user.passwordResetOTPVerified = false;
      await user.save({ validateBeforeSave: false });

      console.error("[AuthService] OTP send failed:", err);
      throw new AppError(
        "There was an error sending the OTP. Try again later!",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Verify OTP for password reset.
   * @param {string} email
   * @param {string} otp
   * @returns {Promise<Object>}
   */
  async verifyPasswordResetOTP(email, otp) {
    // 1. Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(
        "Invalid request. User doesnt exist!.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 2. Check if OTP exists and is not expired
    if (!user.passwordResetOTP || !user.passwordResetOTPExpire) {
      throw new AppError(
        "No OTP found. Please request a new one.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (user.passwordResetOTPExpire < Date.now()) {
      throw new AppError(
        "OTP has expired. Please request a new one.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 3. Hash incoming OTP and compare
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOTP !== user.passwordResetOTP) {
      throw new AppError("Invalid OTP", HTTP_STATUS.BAD_REQUEST);
    }

    // 4. Mark OTP as verified (but don't clear it yet)
    user.passwordResetOTPVerified = true;
    await user.save({ validateBeforeSave: false });

    return {
      message: "OTP verified successfully. You may now reset your password.",
    };
  }

  /**
   * Reset password after OTP verification.
   * @param {string} email
   * @param {string} newPassword
   * @returns {Promise<Object>} - New session data
   */
  async resetPasswordAfterOTP(email, newPassword) {
    // 1. Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid request", HTTP_STATUS.BAD_REQUEST);
    }

    // 2. Check if OTP was verified
    if (!user.passwordResetOTPVerified) {
      throw new AppError(
        "OTP verification required. Please verify your OTP first.",
        HTTP_STATUS.FORBIDDEN
      );
    }

    // 3. Check if OTP is still valid (not expired)
    if (
      !user.passwordResetOTPExpire ||
      user.passwordResetOTPExpire < Date.now()
    ) {
      throw new AppError(
        "OTP has expired. Please request a new one.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 4. Update password
    const salt = await bcrypt.genSalt(12);
    user.password_hash = await bcrypt.hash(newPassword, salt);

    // 5. Clear OTP fields
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpire = undefined;
    user.passwordResetOTPVerified = false;

    await user.save();

    // 6. Auto-login: Generate new token
    const roles =
      user.roles && user.roles.length > 0
        ? user.roles
        : user.active_role
          ? [user.active_role]
          : [];
    const activeRole = user.active_role || (roles.length > 0 ? roles[0] : null);
    const payload = { id: user.user_id, role: activeRole, roles: roles };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: user.user_id });

    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      user: {
        id: user.user_id,
        name: user.full_name,
        email: user.email,
        role: activeRole,
        active_role: activeRole,
        roles: roles,
      },
      accessToken,
      refreshToken,
    };

  }

  /**
   * Switch the active role of a user.
   * @param {string} userId - ID of the user
   * @param {string} newRole - The target role to switch to
   * @returns {Promise<Object>} - New session data
   */
  async switchRole(userId, newRole) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    // Check if user has permission for this role
    const userRoles =
      user.roles && user.roles.length > 0
        ? user.roles
        : user.active_role
          ? [user.active_role]
          : [];

    if (!userRoles.includes(newRole)) {
      console.warn(
        `[AuthSecurity] User ${userId} attempted to switch to unauthorized role: ${newRole}`
      );
      throw new AppError(
        "You do not have permission to switch to this role.",
        HTTP_STATUS.FORBIDDEN
      );
    }

    const payload = { id: user._id, role: newRole, roles: userRoles };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: user._id });

    // Update active role and store refresh token in DB
    user.active_role = newRole;
    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      user: {
        id: user._id,
        _id: user._id,
        name: user.full_name,
        email: user.email,
        role: newRole,
        active_role: newRole,
        roles: userRoles,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh Access Token using Refresh Token
   * @param {string} refreshToken 
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new AppError("Refresh token required", HTTP_STATUS.UNAUTHORIZED);
    }

    // 1. Verify Refresh Token
    let decoded;
    try {
      decoded = verifyToken(refreshToken);
    } catch (err) {
      throw new AppError("Invalid or expired refresh token", HTTP_STATUS.UNAUTHORIZED);
    }

    // 2. Check if user exists and has this refresh token
    const user = await userRepository.findById(decoded.id);
    if (!user || user.refresh_token !== refreshToken) {
      throw new AppError("Token invalid or revoked", HTTP_STATUS.UNAUTHORIZED);
    }

    // 3. Generate new tokens
    const roles = user.roles && user.roles.length > 0 ? user.roles : (user.active_role ? [user.active_role] : []);
    const activeRole = user.active_role || (roles.length > 0 ? roles[0] : null);

    const payload = { id: user._id, role: activeRole, roles: roles };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken({ id: user._id });

    // 4. Rotate Refresh Token
    user.refresh_token = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }



}

export default new AuthService();
