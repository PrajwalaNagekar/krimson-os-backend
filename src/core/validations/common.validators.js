import Joi from "joi";

/**
 * Common reusable Joi validation schemas
 * Used across all modules to ensure consistency
 */

// MongoDB ObjectId validation
export const mongoId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Invalid ID format",
  });

// UUID validation
export const uuid = Joi.string().uuid().messages({
  "string.guid": "Invalid UUID format",
});

// Email validation
export const email = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: true } })
  .lowercase()
  .trim()
  .messages({
    "string.email": "Please provide a valid email address",
  });

// Password validation
export const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 128 characters",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  });

// Simple password (for temporary/generated passwords)
export const simplePassword = Joi.string().min(6).max(128).messages({
  "string.min": "Password must be at least 6 characters long",
  "string.max": "Password cannot exceed 128 characters",
});

// Full name validation
export const fullName = Joi.string()
  .min(2)
  .max(100)
  .trim()
  .pattern(/^[a-zA-Z\s'-]+$/)
  .messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 100 characters",
    "string.pattern.base":
      "Name can only contain letters, spaces, hyphens, and apostrophes",
  });

// Phone number validation (international format)
export const phoneNumber = Joi.string()
  .pattern(/^\+?[1-9]\d{1,14}$/)
  .messages({
    "string.pattern.base":
      "Please provide a valid phone number in international format",
  });

// Date validation (ISO 8601)
export const isoDate = Joi.date().iso().messages({
  "date.format": "Please provide a valid ISO date",
});

// Date of birth validation
export const dateOfBirth = Joi.date().max("now").messages({
  "date.max": "Date of birth cannot be in the future",
});

// URL validation
export const url = Joi.string().uri().messages({
  "string.uri": "Please provide a valid URL",
});

// Enum status validation
export const status = Joi.string()
  .valid("active", "inactive", "suspended")
  .default("active")
  .messages({
    "any.only": "Status must be one of: active, inactive, suspended",
  });

// Gender validation
export const gender = Joi.string()
  .valid("male", "female", "other", "prefer_not_to_say")
  .messages({
    "any.only": "Gender must be one of: male, female, other, prefer_not_to_say",
  });

// Pagination validation
export const pagination = {
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a positive integer",
    "number.min": "Page must be a positive integer",
  }),

  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.min": "Limit must be between 1 and 100",
    "number.max": "Limit must be between 1 and 100",
  }),

  sortBy: Joi.string().default("created_at").messages({
    "string.base": "Invalid sort field",
  }),

  order: Joi.string()
    .valid("asc", "desc", "ascending", "descending")
    .default("desc")
    .messages({
      "any.only": "Order must be asc or desc",
    }),
};

// Search query validation
export const searchQuery = Joi.string().min(1).max(100).trim().messages({
  "string.min": "Search query must be between 1 and 100 characters",
  "string.max": "Search query must be between 1 and 100 characters",
  "string.empty": "Search query cannot be empty",
});

// ID parameter validation (for route params)
export const idParam = Joi.object({
  id: mongoId.required(),
});

// Common address schema
export const address = Joi.object({
  street: Joi.string().max(200).trim(),
  city: Joi.string().max(100).trim(),
  state: Joi.string().max(100).trim(),
  country: Joi.string().max(100).trim(),
  postal_code: Joi.string().max(20).trim(),
  coordinates: Joi.object({
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
  }),
});

// Timezone validation
export const timezone = Joi.string().default("Asia/Singapore").messages({
  "string.base": "Invalid timezone",
});

// Boolean with strict validation
export const strictBoolean = Joi.boolean().strict().messages({
  "boolean.base": "Value must be a boolean (true/false)",
});

// Array of ObjectIds
export const mongoIdArray = Joi.array().items(mongoId).messages({
  "array.base": "Must be an array of IDs",
});

// Export all common schemas as a single object
export const commonSchemas = {
  mongoId,
  uuid,
  email,
  password,
  simplePassword,
  fullName,
  phoneNumber,
  isoDate,
  dateOfBirth,
  url,
  status,
  gender,
  pagination,
  searchQuery,
  idParam,
  address,
  timezone,
  strictBoolean,
  mongoIdArray,
};

export default commonSchemas;
