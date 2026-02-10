import Joi from "joi";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

/**
 * Teacher validation schemas
 * Handles teacher profile, assignments, and qualifications
 */

// Common ID patterns
const teacherId = Joi.string()
  .pattern(/^TCH-\d{6}$/)
  .messages({
    "string.pattern.base": "Teacher ID must be in format TCH-XXXXXX",
  });

const employeeId = Joi.string().max(50).trim();

// Teacher creation validation
const createTeacher = Joi.object({
  user_id: commonSchemas.mongoId.required(),
  teacher_id: teacherId.required(),
  employee_id: employeeId.required(),

  department: Joi.string().max(100).trim().required(),
  designation: Joi.string().max(100).trim().required(),

  subjects: Joi.array()
    .items(Joi.string().max(100))
    .min(1)
    .required()
    .messages({
      "array.min": "At least one subject is required",
    }),

  qualifications: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().max(100).required(),
        institution: Joi.string().max(200).required(),
        year: Joi.number()
          .integer()
          .min(1950)
          .max(new Date().getFullYear())
          .required(),
        specialization: Joi.string().max(100).optional(),
      })
    )
    .min(1)
    .required(),

  experience_years: Joi.number().min(0).max(50).default(0),

  date_of_joining: commonSchemas.isoDate.required(),

  employment_type: Joi.string()
    .valid("full-time", "part-time", "contract", "visiting")
    .default("full-time"),

  classes_assigned: Joi.array()
    .items(
      Joi.object({
        grade: Joi.string().required(),
        section: Joi.string().required(),
        subject: Joi.string().required(),
      })
    )
    .optional(),

  phone: commonSchemas.phoneNumber.optional(),
  gender: commonSchemas.gender.required(),
  date_of_birth: commonSchemas.dateOfBirth.required(),
  address: commonSchemas.address.optional(),

  emergency_contact: Joi.object({
    name: commonSchemas.fullName.required(),
    relationship: Joi.string().max(50).required(),
    phone: commonSchemas.phoneNumber.required(),
  }).optional(),

  status: commonSchemas.status.optional(),
  created_by: Joi.string().max(100).optional(),
});

// Teacher update validation
const updateTeacher = Joi.object({
  department: Joi.string().max(100).trim().optional(),
  designation: Joi.string().max(100).trim().optional(),
  subjects: Joi.array().items(Joi.string().max(100)).optional(),
  employment_type: Joi.string()
    .valid("full-time", "part-time", "contract", "visiting")
    .optional(),
  classes_assigned: Joi.array()
    .items(
      Joi.object({
        grade: Joi.string().required(),
        section: Joi.string().required(),
        subject: Joi.string().required(),
      })
    )
    .optional(),
  phone: commonSchemas.phoneNumber.optional(),
  address: commonSchemas.address.optional(),
  status: commonSchemas.status.optional(),
  updated_by: Joi.string().max(100).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// List teachers
const listTeachers = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("teacher_id", "employee_id", "department", "created_at")
    .default("teacher_id"),
  order: commonSchemas.pagination.order,
  department: Joi.string().optional(),
  subject: Joi.string().optional(),
  status: commonSchemas.status.optional(),
  employment_type: Joi.string()
    .valid("full-time", "part-time", "contract", "visiting")
    .optional(),
  search: commonSchemas.searchQuery.optional(),
});

// Get teacher by ID
const getTeacherById = commonSchemas.idParam;

// Assign class to teacher
const assignClass = Joi.object({
  teacher_id: commonSchemas.mongoId.required(),
  grade: Joi.string().required(),
  section: Joi.string().required(),
  subject: Joi.string().required(),
  academic_year: Joi.string()
    .pattern(/^\d{4}-\d{4}$/)
    .required(),
});

export const teacherValidators = {
  createTeacher,
  updateTeacher,
  listTeachers,
  getTeacherById,
  assignClass,
};

export default teacherValidators;
