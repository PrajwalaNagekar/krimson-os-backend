import Joi from "joi";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

/**
 * Parent/Guardian validation schemas
 */

const createParent = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  parent_id: Joi.string()
    .pattern(/^PAR-\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Parent ID must be in format PAR-XXXXXX",
    }),

  relationship_to_student: Joi.string()
    .valid(
      "father",
      "mother",
      "guardian",
      "grandfather",
      "grandmother",
      "uncle",
      "aunt",
      "other"
    )
    .required(),

  occupation: Joi.string().max(100).trim().optional(),
  employer: Joi.string().max(200).trim().optional(),

  phone: commonSchemas.phoneNumber.required(),
  alternate_phone: commonSchemas.phoneNumber.optional(),

  address: commonSchemas.address.optional(),

  children: Joi.array()
    .items(commonSchemas.mongoId)
    .min(1)
    .required()
    .messages({
      "array.min": "At least one child must be associated",
    }),

  is_primary_contact: commonSchemas.strictBoolean.default(false),
  is_emergency_contact: commonSchemas.strictBoolean.default(false),

  can_pickup_child: commonSchemas.strictBoolean.default(true),

  preferred_communication: Joi.string()
    .valid("email", "sms", "phone", "app")
    .default("app"),

  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

const updateParent = Joi.object({
  occupation: Joi.string().max(100).trim().optional(),
  employer: Joi.string().max(200).trim().optional(),
  phone: commonSchemas.phoneNumber.optional(),
  alternate_phone: commonSchemas.phoneNumber.optional(),
  address: commonSchemas.address.optional(),
  is_primary_contact: commonSchemas.strictBoolean.optional(),
  is_emergency_contact: commonSchemas.strictBoolean.optional(),
  can_pickup_child: commonSchemas.strictBoolean.optional(),
  preferred_communication: Joi.string()
    .valid("email", "sms", "phone", "app")
    .optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const listParents = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string().valid("parent_id", "created_at").default("parent_id"),
  order: commonSchemas.pagination.order,
  relationship: Joi.string()
    .valid(
      "father",
      "mother",
      "guardian",
      "grandfather",
      "grandmother",
      "uncle",
      "aunt",
      "other"
    )
    .optional(),
  status: commonSchemas.status.optional(),
  search: commonSchemas.searchQuery.optional(),
});

const getParentById = commonSchemas.idParam;

// Link child to parent
const linkChild = Joi.object({
  parent_id: commonSchemas.mongoId.required(),
  child_id: commonSchemas.mongoId.required(),
});

export const parentValidators = {
  createParent,
  updateParent,
  listParents,
  getParentById,
  linkChild,
};

export default parentValidators;
