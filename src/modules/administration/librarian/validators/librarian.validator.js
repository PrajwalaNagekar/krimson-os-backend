import Joi from "joi";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

const createLibrarian = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  librarian_id: Joi.string()
    .pattern(/^LIB-\d{6}$/)
    .required(),
  employee_id: Joi.string().max(50).trim().required(),
  library_section: Joi.string().max(100).optional(),
  qualifications: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().required(),
        institution: Joi.string().required(),
        year: Joi.number().integer().required(),
      })
    )
    .optional(),
  phone: commonSchemas.phoneNumber.optional(),
  date_of_joining: commonSchemas.isoDate.required(),
  shift: Joi.string()
    .valid("morning", "afternoon", "full-day")
    .default("full-day"),
  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

const updateLibrarian = Joi.object({
  library_section: Joi.string().max(100).optional(),
  phone: commonSchemas.phoneNumber.optional(),
  shift: Joi.string().valid("morning", "afternoon", "full-day").optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
}).min(1);

const listLibrarians = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("librarian_id", "created_at")
    .default("librarian_id"),
  order: commonSchemas.pagination.order,
  shift: Joi.string().valid("morning", "afternoon", "full-day").optional(),
  status: commonSchemas.status.optional(),
  search: commonSchemas.searchQuery.optional(),
});

const getLibrarianById = commonSchemas.idParam;

export const librarianValidators = {
  createLibrarian,
  updateLibrarian,
  listLibrarians,
  getLibrarianById,
};

export default librarianValidators;
