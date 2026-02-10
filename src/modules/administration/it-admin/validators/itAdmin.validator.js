import Joi from "joi";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

const createITAdmin = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  it_admin_id: Joi.string()
    .pattern(/^ITA-\d{6}$/)
    .required(),
  employee_id: Joi.string().max(50).trim().required(),
  department: Joi.string().max(100).default("IT & Systems"),
  specialization: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional(),
  phone: commonSchemas.phoneNumber.optional(),
  date_of_joining: commonSchemas.isoDate.required(),
  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

const updateITAdmin = Joi.object({
  department: Joi.string().max(100).optional(),
  specialization: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional(),
  phone: commonSchemas.phoneNumber.optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
}).min(1);

const listITAdmins = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("it_admin_id", "created_at")
    .default("it_admin_id"),
  order: commonSchemas.pagination.order,
  status: commonSchemas.status.optional(),
  search: commonSchemas.searchQuery.optional(),
});

const getITAdminById = commonSchemas.idParam;

export const itAdminValidators = {
  createITAdmin,
  updateITAdmin,
  listITAdmins,
  getITAdminById,
};

export default itAdminValidators;
