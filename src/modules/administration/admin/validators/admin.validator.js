import Joi from "joi";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

const createAdmin = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  admin_id: Joi.string()
    .pattern(/^ADM-\d{6}$/)
    .required(),
  employee_id: Joi.string().max(50).trim().required(),
  department: Joi.string().max(100).default("Administration"),
  designation: Joi.string().max(100).trim().required(),
  phone: commonSchemas.phoneNumber.optional(),
  date_of_joining: commonSchemas.isoDate.required(),
  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

const updateAdmin = Joi.object({
  department: Joi.string().max(100).optional(),
  designation: Joi.string().max(100).trim().optional(),
  phone: commonSchemas.phoneNumber.optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
}).min(1);

const listAdmins = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string().valid("admin_id", "created_at").default("admin_id"),
  order: commonSchemas.pagination.order,
  status: commonSchemas.status.optional(),
  search: commonSchemas.searchQuery.optional(),
});

const getAdminById = commonSchemas.idParam;

export const adminValidators = {
  createAdmin,
  updateAdmin,
  listAdmins,
  getAdminById,
};

export default adminValidators;
