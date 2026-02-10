import Joi from "joi";
import { commonSchemas } from "../../../core/validations/common.validators.js";

const createCounselor = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  counselor_id: Joi.string()
    .pattern(/^CNS-\d{6}$/)
    .required(),
  employee_id: Joi.string().max(50).trim().required(),
  specialization: Joi.array().items(Joi.string()).min(1).required(),
  license_number: Joi.string().max(100).trim().optional(),
  phone: commonSchemas.phoneNumber.optional(),
  office_location: Joi.string().max(200).optional(),
  available_hours: Joi.object({
    monday: Joi.string().optional(),
    tuesday: Joi.string().optional(),
    wednesday: Joi.string().optional(),
    thursday: Joi.string().optional(),
    friday: Joi.string().optional(),
  }).optional(),
  date_of_joining: commonSchemas.isoDate.required(),
  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

const updateCounselor = Joi.object({
  specialization: Joi.array().items(Joi.string()).optional(),
  phone: commonSchemas.phoneNumber.optional(),
  office_location: Joi.string().max(200).optional(),
  available_hours: Joi.object({
    monday: Joi.string().optional(),
    tuesday: Joi.string().optional(),
    wednesday: Joi.string().optional(),
    thursday: Joi.string().optional(),
    friday: Joi.string().optional(),
  }).optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
}).min(1);

const listCounselors = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("counselor_id", "created_at")
    .default("counselor_id"),
  order: commonSchemas.pagination.order,
  status: commonSchemas.status.optional(),
  search: commonSchemas.searchQuery.optional(),
});

const getCounselorById = commonSchemas.idParam;

export const counselorValidators = {
  createCounselor,
  updateCounselor,
  listCounselors,
  getCounselorById,
};

export default counselorValidators;
