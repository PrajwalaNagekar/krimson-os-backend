import mongoose from "mongoose";

/**
 * Mongoose plugin to add createdBy and updatedBy fields to a schema.
 * @param {mongoose.Schema} schema - The Mongoose schema to apply the plugin to.
 */

export const auditPlugin = (schema) => {
    schema.add({
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
            default: null
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
            default: null
        }
    });

    // Optionally add indexed for performance if these fields are frequently queried
    schema.index({ createdBy: 1 });
    schema.index({ updatedBy: 1 });
};