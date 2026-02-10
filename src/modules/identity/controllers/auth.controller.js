import authService from "../../../services/authService.js";
import { HTTP_STATUS } from "../../../utils/constants.js";

/**
 * Auth Controller
 * Handles authentication related requests
 */

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send OTP for password reset
 */
export const sendPasswordResetOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.sendPasswordResetOTP(email);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: null,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP for password reset
 */
export const verifyPasswordResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyPasswordResetOTP(email, otp);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: null,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password after OTP verification
 */
export const resetPasswordAfterOTP = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.resetPasswordAfterOTP(email, password);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

export const switchRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const userId = req.user.user_id; // From auth middleware

    const result = await authService.switchRole(userId, role);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: `Switched to role: ${role}`,
    });
  } catch (error) {
    next(error);
  }
};
