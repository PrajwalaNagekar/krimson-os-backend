import Joi from "joi";
import { ROLES } from "../../../utils/constants.js";
import { commonSchemas } from "../../../core/validations/common.validators.js";

/**
 * Authentication validation schemas
 * Handles login, registration, password reset, and SSO operations
 */

// Login validation
const login = Joi.object({
  email: commonSchemas.email.required(),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
  remember_me: commonSchemas.strictBoolean.optional().default(false),
});

// SSO login validation
const ssoLogin = Joi.object({
  provider: Joi.string()
    .valid("google", "microsoft", "azure")
    .required()
    .messages({
      "any.only": "Provider must be one of: google, microsoft, azure",
      "any.required": "SSO provider is required",
    }),
  id_token: Joi.string().required().messages({
    "any.required": "ID token is required",
  }),
  access_token: Joi.string().optional(),
});

// Register/Signup validation
const register = Joi.object({
  email: commonSchemas.email.required(),
  full_name: commonSchemas.fullName.required(),
  password: commonSchemas.password.required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Password confirmation is required",
    }),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .default(ROLES.STUDENT)
    .messages({
      "any.only": `Role must be one of: ${Object.values(ROLES).join(", ")}`,
    }),
  terms_accepted: commonSchemas.strictBoolean.valid(true).required().messages({
    "any.only": "You must accept the terms and conditions",
    "any.required": "Terms acceptance is required",
  }),
});

// Forgot password validation
const forgotPassword = Joi.object({
  email: commonSchemas.email.required(),
});

// Reset password validation
const resetPassword = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Reset token is required",
    "string.empty": "Reset token cannot be empty",
  }),
  password: commonSchemas.password.required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Password confirmation is required",
    }),
});

// Verify email validation
const verifyEmail = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Verification token is required",
  }),
});

// Resend verification email
const resendVerification = Joi.object({
  email: commonSchemas.email.required(),
});

// Refresh token validation
const refreshToken = Joi.object({
  refresh_token: Joi.string().required().messages({
    "any.required": "Refresh token is required",
    "string.empty": "Refresh token cannot be empty",
  }),
});

// Logout validation (optional session_id)
const logout = Joi.object({
  session_id: Joi.string().optional(),
  logout_all_devices: commonSchemas.strictBoolean.optional().default(false),
});

// Switch role validation (during active session)
const switchRole = Joi.object({
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      "any.only": `Role must be one of: ${Object.values(ROLES).join(", ")}`,
      "any.required": "Role is required",
    }),
});

// Validate OTP (for MFA)
const validateOtp = Joi.object({
  email: commonSchemas.email.required(),
  otp: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),
});

// Enable MFA validation
const enableMfa = Joi.object({
  method: Joi.string().valid("email", "sms", "app").required().messages({
    "any.only": "MFA method must be one of: email, sms, app",
    "any.required": "MFA method is required",
  }),
  phone_number: Joi.when("method", {
    is: "sms",
    then: commonSchemas.phoneNumber.required(),
    otherwise: Joi.forbidden(),
  }),
});

// Disable MFA validation
const disableMfa = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "Password is required to disable MFA",
  }),
  otp: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required to disable MFA",
    }),
});

// Session validation (get active sessions)
const getSessions = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
});

// Revoke session validation
const revokeSession = Joi.object({
  session_id: Joi.string().required().messages({
    "any.required": "Session ID is required",
  }),
});

// Export all auth validators
export const authValidators = {
  login,
  ssoLogin,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  refreshToken,
  logout,
  switchRole,
  validateOtp,
  enableMfa,
  disableMfa,
  getSessions,
  revokeSession,
};

export default authValidators;
