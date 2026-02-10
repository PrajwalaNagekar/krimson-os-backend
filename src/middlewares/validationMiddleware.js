import Joi from "joi";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS } from "../utils/constants.js";

/**
 * Enhanced validation middleware factory
 * Validates request data against a Joi schema with improved error handling
 *
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against
 * @param {string} source - Property to validate ('body', 'query', 'params', 'headers')
 * @param {Object} options - Additional validation options
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = "body", options = {}) => {
    const defaultOptions = {
        abortEarly: false, // Return all errors, not just the first
        stripUnknown: true, // Remove unknown fields
        convert: true, // Attempt type conversion
        allowUnknown: false, // Disallow unknown keys
        ...options,
    };

    return (req, res, next) => {
        const { error, value } = schema.validate(req[source], defaultOptions);

        if (error) {
            // Format error messages for better readability
            const errors = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message.replace(/"/g, ""),
                type: detail.type,
            }));

            // Create user-friendly error message
            const errorMessage = errors
                .map((e) => `${e.field}: ${e.message}`)
                .join("; ");

            // For development, include detailed errors
            const errorResponse =
                process.env.NODE_ENV === "development"
                    ? { message: errorMessage, errors }
                    : { message: errorMessage };

            return next(
                new AppError(errorMessage, HTTP_STATUS.BAD_REQUEST, errorResponse)
            );
        }

        // Replace the original request data with validated & sanitized data
        req[source] = value;
        next();
    };
};

/**
 * Validate multiple sources in a single middleware
 * @param {Object} schemas - Object with source names as keys and schemas as values
 * @example validateMultiple({ body: userSchema, query: paginationSchema })
 */
export const validateMultiple = (schemas) => {
    return (req, res, next) => {
        const errors = [];

        for (const [source, schema] of Object.entries(schemas)) {
            const { error, value } = schema.validate(req[source], {
                abortEarly: false,
                stripUnknown: true,
                convert: true,
            });

            if (error) {
                error.details.forEach((detail) => {
                    errors.push({
                        source,
                        field: detail.path.join("."),
                        message: detail.message.replace(/"/g, ""),
                    });
                });
            } else {
                req[source] = value;
            }
        }

        if (errors.length > 0) {
            const errorMessage = errors
                .map((e) => `${e.source}.${e.field}: ${e.message}`)
                .join("; ");
            return next(
                new AppError(errorMessage, HTTP_STATUS.BAD_REQUEST, { errors })
            );
        }

        next();
    };
};

export default validate;
