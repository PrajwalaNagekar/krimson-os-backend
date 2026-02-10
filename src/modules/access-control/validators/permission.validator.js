import Joi from "joi";
import { commonSchemas } from "../../../core/validations/common.validators.js";

/**
 * Permission validation schemas for Access Control module
 * Handles permission CRUD operations and resource management
 */

// Permission creation validation
const createPermission = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .pattern(/^[a-z0-9_:.]+$/)
    .required()
    .messages({
      "string.min": "Permission name must be at least 2 characters",
      "string.max": "Permission name cannot exceed 100 characters",
      "string.pattern.base":
        "Permission name can only contain lowercase letters, numbers, underscores, colons, and dots",
      "any.required": "Permission name is required",
    }),

  display_name: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Display name must be at least 2 characters",
    "string.max": "Display name cannot exceed 100 characters",
    "any.required": "Display name is required",
  }),

  description: Joi.string().max(500).trim().optional().messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  resource: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Resource must be at least 2 characters",
    "string.max": "Resource cannot exceed 100 characters",
    "any.required": "Resource is required",
  }),

  action: Joi.string()
    .valid(
      "create",
      "read",
      "update",
      "delete",
      "approve",
      "reject",
      "export",
      "manage",
      "*"
    )
    .required()
    .messages({
      "any.only":
        "Action must be one of: create, read, update, delete, approve, reject, export, manage, *",
      "any.required": "Action is required",
    }),

  scope: Joi.string()
    .valid("global", "organization", "department", "team", "own")
    .default("own")
    .messages({
      "any.only":
        "Scope must be one of: global, organization, department, team, own",
    }),

  conditions: Joi.object().optional(),

  is_active: commonSchemas.strictBoolean.default(true),

  category: Joi.string().max(50).trim().optional().messages({
    "string.max": "Category cannot exceed 50 characters",
  }),

  priority: Joi.number().integer().min(0).max(100).default(50).messages({
    "number.min": "Priority must be at least 0",
    "number.max": "Priority cannot exceed 100",
  }),

  metadata: Joi.object().optional(),

  created_by: Joi.string().max(100).optional(),
});

// Permission update validation
const updatePermission = Joi.object({
  display_name: Joi.string().min(2).max(100).trim().optional(),

  description: Joi.string().max(500).trim().optional(),

  scope: Joi.string()
    .valid("global", "organization", "department", "team", "own")
    .optional(),

  conditions: Joi.object().optional(),

  is_active: commonSchemas.strictBoolean.optional(),

  category: Joi.string().max(50).trim().optional(),

  priority: Joi.number().integer().min(0).max(100).optional(),

  metadata: Joi.object().optional(),

  updated_by: Joi.string().max(100).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Get permission by ID
const getPermissionById = Joi.object({
  id: commonSchemas.mongoId.required(),
});

// List/filter permissions
const listPermissions = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid(
      "name",
      "display_name",
      "resource",
      "action",
      "created_at",
      "priority"
    )
    .default("name"),
  order: commonSchemas.pagination.order,
  is_active: commonSchemas.strictBoolean.optional(),
  resource: Joi.string().optional(),
  action: Joi.string()
    .valid(
      "create",
      "read",
      "update",
      "delete",
      "approve",
      "reject",
      "export",
      "manage",
      "*"
    )
    .optional(),
  scope: Joi.string()
    .valid("global", "organization", "department", "team", "own")
    .optional(),
  category: Joi.string().optional(),
  search: commonSchemas.searchQuery.optional(),
});

// Bulk create permissions
const createBulkPermissions = Joi.object({
  permissions: Joi.array()
    .items(createPermission)
    .min(1)
    .max(100)
    .required()
    .messages({
      "array.min": "At least one permission must be provided",
      "array.max": "Cannot create more than 100 permissions at once",
      "any.required": "Permissions array is required",
    }),
});

// Check if permission exists
const checkPermissionExists = Joi.object({
  resource: Joi.string().required(),
  action: Joi.string().required(),
});

// Get permissions by resource
const getPermissionsByResource = Joi.object({
  resource: Joi.string().required().messages({
    "any.required": "Resource is required",
  }),
});

// Get permissions by category
const getPermissionsByCategory = Joi.object({
  category: Joi.string().required().messages({
    "any.required": "Category is required",
  }),
});

// Export all permission validators
export const permissionValidators = {
  createPermission,
  updatePermission,
  getPermissionById,
  listPermissions,
  createBulkPermissions,
  checkPermissionExists,
  getPermissionsByResource,
  getPermissionsByCategory,
};

export default permissionValidators;
