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
        if (!req[source] || Object.keys(req[source]).length === 0) {
            return next(
                new AppError(`Request ${source} is missing or empty`, HTTP_STATUS.BAD_REQUEST)
            );
        }

        const { error, value } = schema.validate(req[source], defaultOptions);


        if (error) {
            // Format error messages for better readability
            const errorDetails = {};
            error.details.forEach((detail) => {
                errorDetails[detail.path.join(".")] = detail.message.replace(/"/g, "");
            });

            // Create user-friendly error message
            const firstErrorMessage = error.details[0].message.replace(/"/g, "");

            return next(
                new AppError(firstErrorMessage, HTTP_STATUS.BAD_REQUEST, errorDetails)
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
