import Joi from "joi";
import { ROLES } from "../../../../utils/constants.js";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

/**
 * User validation schemas for admin operations
 * Used for creating users across different roles
 */

const createUser = Joi.object({
  full_name: commonSchemas.fullName.required(),
  email: commonSchemas.email.required(),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      "any.only": `Role must be one of: ${Object.values(ROLES).join(", ")}`,
      "any.required": "Role is required",
    }),
  app_access: Joi.string().optional().allow(null, ""),
  status: commonSchemas.status.optional(),
});

const updateUser = Joi.object({
  full_name: commonSchemas.fullName.optional(),
  status: commonSchemas.status.optional(),
  app_access: Joi.string().optional().allow(null, ""),
}).min(1);

const listUsers = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .optional(),
  status: commonSchemas.status.optional(),
  search: commonSchemas.searchQuery.optional(),
});

const getUserById = commonSchemas.idParam;

export const userValidators = {
  createUser,
  updateUser,
  listUsers,
  getUserById,
};

export default userValidators;
