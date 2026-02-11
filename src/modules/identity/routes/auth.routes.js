import express from "express";
import {
  loginUser,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPasswordAfterOTP,
  switchRole,
  refreshToken,
  logoutUser,
} from "../controllers/auth.controller.js";

import validate from "../../../middlewares/validationMiddleware.js";
import { authValidators } from "../validators/auth.validator.js";
import { protect } from "../../../core/auth/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", validate(authValidators.login), loginUser);
router.post("/refresh-token", refreshToken);


// OTP-based password reset (replaces token-based system)
router.post(
  "/forgot-password",
  validate(authValidators.forgotPassword),
  sendPasswordResetOTP
);
router.post(
  "/verify-reset-otp",
  validate(authValidators.validateOtp),
  verifyPasswordResetOTP
);
router.put(
  "/reset-password",
  validate(authValidators.resetPassword),
  resetPasswordAfterOTP
);

// Protected routes
router.post(
  "/switch-role",
  protect,
  validate(authValidators.switchRole),
  switchRole
);

router.post("/logout", protect, logoutUser);

export default router;
