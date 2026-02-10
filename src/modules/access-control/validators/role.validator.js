import Joi from "joi";
import { ROLES } from "../../../utils/constants.js";
import { commonSchemas } from "../../../core/validations/common.validators.js";

/**
 * Role validation schemas for Access Control module
 * Handles role CRUD operations and permission assignments
 */

// Role creation validation
const createRole = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    "string.min": "Role name must be at least 2 characters",
    "string.max": "Role name cannot exceed 50 characters",
    "any.required": "Role name is required",
  }),

  display_name: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Display name must be at least 2 characters",
    "string.max": "Display name cannot exceed 100 characters",
    "any.required": "Display name is required",
  }),

  description: Joi.string().max(500).trim().optional().messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  permissions: Joi.array()
    .items(commonSchemas.mongoId)
    .min(0)
    .default([])
    .messages({
      "array.base": "Permissions must be an array",
    }),

  hierarchy_level: Joi.number().integer().min(1).max(10).default(5).messages({
    "number.min": "Hierarchy level must be at least 1",
    "number.max": "Hierarchy level cannot exceed 10",
  }),

  is_system_role: commonSchemas.strictBoolean.default(false),

  is_active: commonSchemas.strictBoolean.default(true),

  parent_role: commonSchemas.mongoId.optional().allow(null),

  allowed_actions: Joi.array()
    .items(
      Joi.string().valid(
        "create",
        "read",
        "update",
        "delete",
        "approve",
        "reject",
        "export"
      )
    )
    .default(["read"])
    .messages({
      "any.only": "Invalid action in allowed_actions",
    }),

  resource_access: Joi.array().items(Joi.string()).default([]).messages({
    "array.base": "Resource access must be an array",
  }),

  metadata: Joi.object().optional(),

  created_by: Joi.string().max(100).optional(),
});

// Role update validation (all fields optional except IDs)
const updateRole = Joi.object({
  display_name: Joi.string().min(2).max(100).trim().optional(),

  description: Joi.string().max(500).trim().optional(),

  permissions: Joi.array().items(commonSchemas.mongoId).optional(),

  hierarchy_level: Joi.number().integer().min(1).max(10).optional(),

  is_active: commonSchemas.strictBoolean.optional(),

  parent_role: commonSchemas.mongoId.optional().allow(null),

  allowed_actions: Joi.array()
    .items(
      Joi.string().valid(
        "create",
        "read",
        "update",
        "delete",
        "approve",
        "reject",
        "export"
      )
    )
    .optional(),

  resource_access: Joi.array().items(Joi.string()).optional(),

  metadata: Joi.object().optional(),

  updated_by: Joi.string().max(100).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Get role by ID (param validation)
const getRoleById = Joi.object({
  id: commonSchemas.mongoId.required(),
});

// List/filter roles (query validation)
const listRoles = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("name", "display_name", "hierarchy_level", "created_at")
    .default("hierarchy_level"),
  order: commonSchemas.pagination.order,
  is_active: commonSchemas.strictBoolean.optional(),
  is_system_role: commonSchemas.strictBoolean.optional(),
  search: commonSchemas.searchQuery.optional(),
  hierarchy_level: Joi.number().integer().min(1).max(10).optional(),
});

// Assign permission to role
const assignPermission = Joi.object({
  role_id: commonSchemas.mongoId.required(),
  permission_id: commonSchemas.mongoId.required(),
});

// Remove permission from role
const removePermission = Joi.object({
  role_id: commonSchemas.mongoId.required(),
  permission_id: commonSchemas.mongoId.required(),
});

// Assign multiple permissions to role
const assignMultiplePermissions = Joi.object({
  role_id: commonSchemas.mongoId.required(),
  permission_ids: Joi.array()
    .items(commonSchemas.mongoId)
    .min(1)
    .max(100)
    .required()
    .messages({
      "array.min": "At least one permission must be provided",
      "array.max": "Cannot assign more than 100 permissions at once",
    }),
});

// Clone role
const cloneRole = Joi.object({
  source_role_id: commonSchemas.mongoId.required(),
  new_name: Joi.string().min(2).max(50).trim().required().messages({
    "string.min": "Role name must be at least 2 characters",
    "string.max": "Role name cannot exceed 50 characters",
    "any.required": "New role name is required",
  }),
  new_display_name: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Display name must be at least 2 characters",
    "string.max": "Display name cannot exceed 100 characters",
    "any.required": "New display name is required",
  }),
  include_permissions: commonSchemas.strictBoolean.default(true),
});

// Check role permission
const checkPermission = Joi.object({
  role_id: commonSchemas.mongoId.required(),
  action: Joi.string()
    .valid("create", "read", "update", "delete", "approve", "reject", "export")
    .required()
    .messages({
      "any.only": "Invalid action",
      "any.required": "Action is required",
    }),
  resource: Joi.string().required().messages({
    "any.required": "Resource is required",
  }),
});

// Export all role validators
export const roleValidators = {
  createRole,
  updateRole,
  getRoleById,
  listRoles,
  assignPermission,
  removePermission,
  assignMultiplePermissions,
  cloneRole,
  checkPermission,
};

export default roleValidators;
