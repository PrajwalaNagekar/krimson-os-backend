import Joi from "joi";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

const createPrincipal = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  principal_id: Joi.string()
    .pattern(/^PRN-\d{6}$/)
    .required(),
  employee_id: Joi.string().max(50).trim().required(),
  qualifications: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().required(),
        institution: Joi.string().required(),
        year: Joi.number().integer().required(),
      })
    )
    .min(1)
    .required(),
  experience_years: Joi.number().min(0).required(),
  phone: commonSchemas.phoneNumber.optional(),
  office_location: Joi.string().max(200).optional(),
  date_of_joining: commonSchemas.isoDate.required(),
  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

const updatePrincipal = Joi.object({
  phone: commonSchemas.phoneNumber.optional(),
  office_location: Joi.string().max(200).optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
}).min(1);

const listPrincipals = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("principal_id", "created_at")
    .default("principal_id"),
  order: commonSchemas.pagination.order,
  status: commonSchemas.status.optional(),
});

const getPrincipalById = commonSchemas.idParam;

export const principalValidators = {
  createPrincipal,
  updatePrincipal,
  listPrincipals,
  getPrincipalById,
};

export default principalValidators;
