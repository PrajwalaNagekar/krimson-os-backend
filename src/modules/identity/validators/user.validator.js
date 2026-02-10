import Joi from "joi";
import { ROLES } from "../../../utils/constants.js";
import { commonSchemas } from "../../../core/validations/common.validators.js";

/**
 * User validation schemas for Identity module
 * Handles user CRUD operations, role management, and profile updates
 */

// User creation validation
const createUser = Joi.object({
  email: commonSchemas.email.required(),
  full_name: commonSchemas.fullName.required(),
  password: commonSchemas.password.optional(), // Optional for SSO users
  active_role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      "any.only": `Role must be one of: ${Object.values(ROLES).join(", ")}`,
      "any.required": "Active role is required",
    }),
  roles: Joi.array()
    .items(Joi.string().valid(...Object.values(ROLES)))
    .min(1)
    .default((parent) => [parent.active_role])
    .messages({
      "array.min": "User must have at least one role",
      "any.only": `Roles must be from: ${Object.values(ROLES).join(", ")}`,
    }),
  role_data: commonSchemas.mongoId.optional(),
  status: commonSchemas.status.optional(),
  mfa_enabled: commonSchemas.strictBoolean.optional().default(false),
  sso_provider: Joi.string()
    .valid("google", "microsoft", "azure", null)
    .optional(),
  app_access: Joi.string().max(500).optional(),
  avatar_url: commonSchemas.url.optional(),
  timezone: commonSchemas.timezone.optional(),
  created_by: Joi.string().max(100).optional(),
});

// User update validation (all fields optional)
const updateUser = Joi.object({
  full_name: commonSchemas.fullName.optional(),
  active_role: Joi.string()
    .valid(...Object.values(ROLES))
    .optional(),
  roles: Joi.array()
    .items(Joi.string().valid(...Object.values(ROLES)))
    .min(1)
    .optional(),
  role_data: commonSchemas.mongoId.optional(),
  status: commonSchemas.status.optional(),
  mfa_enabled: commonSchemas.strictBoolean.optional(),
  sso_provider: Joi.string()
    .valid("google", "microsoft", "azure", null)
    .optional(),
  app_access: Joi.string().max(500).optional(),
  avatar_url: commonSchemas.url.optional(),
  timezone: commonSchemas.timezone.optional(),
  updated_by: Joi.string().max(100).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Change password validation
const changePassword = Joi.object({
  current_password: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  new_password: commonSchemas.password.required().messages({
    "any.required": "New password is required",
  }),
  confirm_password: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Password confirmation is required",
    }),
});

// Switch role validation
const switchRole = Joi.object({
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      "any.only": `Role must be one of: ${Object.values(ROLES).join(", ")}`,
      "any.required": "Role is required",
    }),
});

// Assign role validation
const assignRole = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      "any.only": `Role must be one of: ${Object.values(ROLES).join(", ")}`,
      "any.required": "Role is required",
    }),
});

// Remove role validation
const removeRole = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      "any.only": `Role must be one of: ${Object.values(ROLES).join(", ")}`,
      "any.required": "Role is required",
    }),
});

// Get user by ID (param validation)
const getUserById = Joi.object({
  id: commonSchemas.mongoId.required(),
});

// List/filter users (query validation)
const listUsers = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("email", "full_name", "created_at", "updated_at", "last_login_at")
    .default("created_at"),
  order: commonSchemas.pagination.order,
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .optional(),
  status: commonSchemas.status.optional(),
  search: commonSchemas.searchQuery.optional(),
  sso_provider: Joi.string().valid("google", "microsoft", "azure").optional(),
});

// Bulk user creation validation
const createBulkUsers = Joi.object({
  users: Joi.array().items(createUser).min(1).max(100).required().messages({
    "array.min": "At least one user must be provided",
    "array.max": "Cannot create more than 100 users at once",
    "any.required": "Users array is required",
  }),
});

// User profile update (limited fields)
const updateProfile = Joi.object({
  full_name: commonSchemas.fullName.optional(),
  avatar_url: commonSchemas.url.optional(),
  timezone: commonSchemas.timezone.optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for profile update",
  });

// Suspend user validation
const suspendUser = Joi.object({
  reason: Joi.string().min(10).max(500).required().messages({
    "string.min": "Suspension reason must be at least 10 characters",
    "string.max": "Suspension reason cannot exceed 500 characters",
    "any.required": "Suspension reason is required",
  }),
  suspended_until: Joi.date().iso().greater("now").optional().messages({
    "date.greater": "Suspension end date must be in the future",
  }),
});

// Reactivate user validation
const reactivateUser = Joi.object({
  note: Joi.string().max(500).optional(),
});

// Export all user validators
export const userValidators = {
  createUser,
  updateUser,
  changePassword,
  switchRole,
  assignRole,
  removeRole,
  getUserById,
  listUsers,
  createBulkUsers,
  updateProfile,
  suspendUser,
  reactivateUser,
};

export default userValidators;
