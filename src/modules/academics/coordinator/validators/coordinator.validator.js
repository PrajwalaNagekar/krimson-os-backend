import Joi from "joi";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

const createCoordinator = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  coordinator_id: Joi.string()
    .pattern(/^CRD-\d{6}$/)
    .required(),
  employee_id: Joi.string().max(50).trim().required(),
  department: Joi.string().max(100).default("Academic Coordination"),
  areas_of_responsibility: Joi.array().items(Joi.string()).min(1).required(),
  grades_managed: Joi.array().items(Joi.string()).optional(),
  phone: commonSchemas.phoneNumber.optional(),
  date_of_joining: commonSchemas.isoDate.required(),
  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

const updateCoordinator = Joi.object({
  department: Joi.string().max(100).optional(),
  areas_of_responsibility: Joi.array().items(Joi.string()).optional(),
  grades_managed: Joi.array().items(Joi.string()).optional(),
  phone: commonSchemas.phoneNumber.optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
}).min(1);

const listCoordinators = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("coordinator_id", "created_at")
    .default("coordinator_id"),
  order: commonSchemas.pagination.order,
  status: commonSchemas.status.optional(),
  search: commonSchemas.searchQuery.optional(),
});

const getCoordinatorById = commonSchemas.idParam;

export const coordinatorValidators = {
  createCoordinator,
  updateCoordinator,
  listCoordinators,
  getCoordinatorById,
};

export default coordinatorValidators;
