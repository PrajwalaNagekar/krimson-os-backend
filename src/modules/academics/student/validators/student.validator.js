import Joi from "joi";
import { commonSchemas } from "../../../../core/validations/common.validators.js";

/**
 * Student validation schemas
 * Handles student profile, enrollment, and academic records
 */

// Student creation validation
const createStudent = Joi.object({
  user_id: commonSchemas.mongoId.required(),

  student_id: Joi.string()
    .pattern(/^STU-\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Student ID must be in format STU-XXXXXX",
      "any.required": "Student ID is required",
    }),

  admission_number: Joi.string().max(50).trim().required().messages({
    "string.max": "Admission number cannot exceed 50 characters",
    "any.required": "Admission number is required",
  }),

  grade: Joi.string()
    .valid(
      "KG1",
      "KG2",
      "G1",
      "G2",
      "G3",
      "G4",
      "G5",
      "G6",
      "G7",
      "G8",
      "G9",
      "G10",
      "G11",
      "G12"
    )
    .required()
    .messages({
      "any.only": "Invalid grade level",
      "any.required": "Grade is required",
    }),

  section: Joi.string().max(10).trim().required().messages({
    "string.max": "Section cannot exceed 10 characters",
    "any.required": "Section is required",
  }),

  roll_number: Joi.string().max(20).trim().optional(),

  date_of_birth: commonSchemas.dateOfBirth.required(),

  gender: commonSchemas.gender.required(),

  blood_group: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .optional(),

  nationality: Joi.string().max(50).trim().optional(),

  address: commonSchemas.address.optional(),

  emergency_contact: Joi.object({
    name: commonSchemas.fullName.required(),
    relationship: Joi.string().max(50).required(),
    phone: commonSchemas.phoneNumber.required(),
    email: commonSchemas.email.optional(),
  }).optional(),

  parent_ids: Joi.array()
    .items(commonSchemas.mongoId)
    .min(1)
    .max(4)
    .required()
    .messages({
      "array.min": "At least one parent/guardian is required",
      "array.max": "Maximum 4 parents/guardians allowed",
    }),

  admission_date: commonSchemas.isoDate.default(() => new Date()),

  academic_year: Joi.string()
    .pattern(/^\d{4}-\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "Academic year must be in format YYYY-YYYY",
      "any.required": "Academic year is required",
    }),

  status: Joi.string()
    .valid("active", "inactive", "transferred", "graduated", "suspended")
    .default("active"),

  medical_conditions: Joi.array().items(Joi.string().max(200)).optional(),

  allergies: Joi.array().items(Joi.string().max(100)).optional(),

  special_needs: Joi.string().max(500).optional(),

  previous_school: Joi.string().max(200).optional(),

  transport_required: commonSchemas.strictBoolean.default(false),

  bus_route: Joi.string().max(100).optional(),

  created_by: Joi.string().max(100).optional(),
});

// Student update validation
const updateStudent = Joi.object({
  grade: Joi.string()
    .valid(
      "KG1",
      "KG2",
      "G1",
      "G2",
      "G3",
      "G4",
      "G5",
      "G6",
      "G7",
      "G8",
      "G9",
      "G10",
      "G11",
      "G12"
    )
    .optional(),

  section: Joi.string().max(10).trim().optional(),

  roll_number: Joi.string().max(20).trim().optional(),

  address: commonSchemas.address.optional(),

  emergency_contact: Joi.object({
    name: commonSchemas.fullName,
    relationship: Joi.string().max(50),
    phone: commonSchemas.phoneNumber,
    email: commonSchemas.email.optional(),
  }).optional(),

  status: Joi.string()
    .valid("active", "inactive", "transferred", "graduated", "suspended")
    .optional(),

  medical_conditions: Joi.array().items(Joi.string().max(200)).optional(),

  allergies: Joi.array().items(Joi.string().max(100)).optional(),

  special_needs: Joi.string().max(500).optional(),

  transport_required: commonSchemas.strictBoolean.optional(),

  bus_route: Joi.string().max(100).optional(),

  updated_by: Joi.string().max(100).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Get student by ID
const getStudentById = Joi.object({
  id: commonSchemas.mongoId.required(),
});

// List/filter students
const listStudents = Joi.object({
  page: commonSchemas.pagination.page,
  limit: commonSchemas.pagination.limit,
  sortBy: Joi.string()
    .valid("student_id", "admission_number", "grade", "section", "created_at")
    .default("student_id"),
  order: commonSchemas.pagination.order,
  grade: Joi.string()
    .valid(
      "KG1",
      "KG2",
      "G1",
      "G2",
      "G3",
      "G4",
      "G5",
      "G6",
      "G7",
      "G8",
      "G9",
      "G10",
      "G11",
      "G12"
    )
    .optional(),
  section: Joi.string().optional(),
  status: Joi.string()
    .valid("active", "inactive", "transferred", "graduated", "suspended")
    .optional(),
  academic_year: Joi.string()
    .pattern(/^\d{4}-\d{4}$/)
    .optional(),
  search: commonSchemas.searchQuery.optional(),
});

// Promote student to next grade
const promoteStudent = Joi.object({
  student_id: commonSchemas.mongoId.required(),
  new_grade: Joi.string()
    .valid(
      "KG1",
      "KG2",
      "G1",
      "G2",
      "G3",
      "G4",
      "G5",
      "G6",
      "G7",
      "G8",
      "G9",
      "G10",
      "G11",
      "G12"
    )
    .required(),
  new_section: Joi.string().max(10).trim().required(),
  academic_year: Joi.string()
    .pattern(/^\d{4}-\d{4}$/)
    .required(),
  notes: Joi.string().max(500).optional(),
});

// Transfer student
const transferStudent = Joi.object({
  student_id: commonSchemas.mongoId.required(),
  transfer_date: commonSchemas.isoDate.required(),
  transfer_to: Joi.string().max(200).required().messages({
    "any.required": "Transfer destination is required",
  }),
  reason: Joi.string().max(500).required().messages({
    "any.required": "Transfer reason is required",
  }),
  notes: Joi.string().max(500).optional(),
});

// Suspend student
const suspendStudent = Joi.object({
  student_id: commonSchemas.mongoId.required(),
  reason: Joi.string().min(10).max(500).required().messages({
    "string.min": "Suspension reason must be at least 10 characters",
    "any.required": "Suspension reason is required",
  }),
  suspended_until: commonSchemas.isoDate.optional(),
  notify_parents: commonSchemas.strictBoolean.default(true),
});

// Export all student validators
export const studentValidators = {
  createStudent,
  updateStudent,
  getStudentById,
  listStudents,
  promoteStudent,
  transferStudent,
  suspendStudent,
};

export default studentValidators;
