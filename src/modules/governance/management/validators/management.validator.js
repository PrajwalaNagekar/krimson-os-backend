import Joi from "joi";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

const createManagement = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  management_id: Joi.string()
    .pattern(/^MGT-\d{6}$/)
    .required(),
  position: Joi.string().max(100).trim().required(),
  board_member_type: Joi.string()
    .valid("trustee", "director", "advisor", "chairman")
    .required(),
  phone: commonSchemas.phoneNumber.optional(),
  term_start: commonSchemas.isoDate.required(),
  term_end: commonSchemas.isoDate.optional(),
  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

const updateManagement = Joi.object({
  position: Joi.string().max(100).trim().optional(),
  phone: commonSchemas.phoneNumber.optional(),
  term_end: commonSchemas.isoDate.optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
}).min(1);

const listManagement = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("management_id", "created_at")
    .default("management_id"),
  order: commonSchemas.pagination.order,
  board_member_type: Joi.string()
    .valid("trustee", "director", "advisor", "chairman")
    .optional(),
  status: commonSchemas.status.optional(),
});

const getManagementById = commonSchemas.idParam;

export const managementValidators = {
  createManagement,
  updateManagement,
  listManagement,
  getManagementById,
};

export default managementValidators;
