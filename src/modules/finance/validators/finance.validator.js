import Joi from "joi";
import { commonSchemas } from "../../../core/validations/common.validators.js";

const createFinanceOfficer = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  officer_id: Joi.string()
    .pattern(/^FIN-\d{6}$/)
    .required(),
  employee_id: Joi.string().max(50).trim().required(),
  department: Joi.string().max(100).default("Finance"),
  designation: Joi.string().max(100).trim().required(),
  responsibilities: Joi.array().items(Joi.string()).optional(),
  phone: commonSchemas.phoneNumber.optional(),
  date_of_joining: commonSchemas.isoDate.required(),
  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

const updateFinanceOfficer = Joi.object({
  department: Joi.string().max(100).optional(),
  designation: Joi.string().max(100).trim().optional(),
  responsibilities: Joi.array().items(Joi.string()).optional(),
  phone: commonSchemas.phoneNumber.optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
}).min(1);

const listFinanceOfficers = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string().valid("officer_id", "created_at").default("officer_id"),
  order: commonSchemas.pagination.order,
  status: commonSchemas.status.optional(),
  search: commonSchemas.searchQuery.optional(),
});

const getFinanceOfficerById = commonSchemas.idParam;

export const financeValidators = {
  createFinanceOfficer,
  updateFinanceOfficer,
  listFinanceOfficers,
  getFinanceOfficerById,
};

export default financeValidators;
