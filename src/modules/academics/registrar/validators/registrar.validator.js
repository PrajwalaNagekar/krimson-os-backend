import Joi from "joi";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

const createRegistrar = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  registrar_id: Joi.string()
    .pattern(/^REG-\d{6}$/)
    .required(),
  employee_id: Joi.string().max(50).trim().required(),
  department: Joi.string().max(100).default("Registrar Office"),
  phone: commonSchemas.phoneNumber.optional(),
  date_of_joining: commonSchemas.isoDate.required(),
  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

const updateRegistrar = Joi.object({
  department: Joi.string().max(100).optional(),
  phone: commonSchemas.phoneNumber.optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
}).min(1);

const listRegistrars = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("registrar_id", "created_at")
    .default("registrar_id"),
  order: commonSchemas.pagination.order,
  status: commonSchemas.status.optional(),
  search: commonSchemas.searchQuery.optional(),
});

const getRegistrarById = commonSchemas.idParam;

export const registrarValidators = {
  createRegistrar,
  updateRegistrar,
  listRegistrars,
  getRegistrarById,
};

export default registrarValidators;
