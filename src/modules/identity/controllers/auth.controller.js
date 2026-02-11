import authService from "../services/authService.js";
import { HTTP_STATUS } from "../../../utils/constants.js";
import { ApiResponse } from "../../../utils/ApiReponse.js";

/**
 * Auth Controller
 * Handles authentication related requests
 */

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return next(new AppError("Email and password are required", HTTP_STATUS.BAD_REQUEST));
    }

    const result = await authService.login(email, password);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    return res
      .status(HTTP_STATUS.OK)
      .cookie("accessToken", result.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 mins
      })
      .cookie("refreshToken", result.refreshToken, {
        ...cookieOptions,
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      })
      .json(new ApiResponse(HTTP_STATUS.OK, result, "Login successful"));
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

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, null, result.message));
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

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, null, result.message));
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

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, result, "Password reset successful")
      );
  } catch (error) {
    next(error);
  }
};

export const switchRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const userId = req.user._id; // From auth middleware

    const result = await authService.switchRole(userId, role);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    return res
      .status(HTTP_STATUS.OK)
      .cookie("accessToken", result.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", result.refreshToken, {
        ...cookieOptions,
        maxAge: 2 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(HTTP_STATUS.OK, result, `Switched to role: ${role}`)
      );
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    return res
      .status(HTTP_STATUS.OK)
      .cookie("accessToken", result.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", result.refreshToken, {
        ...cookieOptions,
        maxAge: 2 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(HTTP_STATUS.OK, result, "Token refreshed successfully")
      );
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    return res
      .status(HTTP_STATUS.OK)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(HTTP_STATUS.OK, null, "Logout successful"));
  } catch (error) {
    next(error);
  }
};
