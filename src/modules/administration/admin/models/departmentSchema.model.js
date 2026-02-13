import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

/**
 * Department Schema
 *
 * This schema represents organizational departments within the system.
 * Each department can have a head (User reference), status, and soft delete capability.
 *
 * Features:
 * - Auto-generated unique department code (DEP-XXXXXXXX format)
 * - Department head assignment (optional User reference)
 * - Active/Inactive status management
 * - Audit trail (createdBy, updatedBy)
 * - Soft delete support (isDeleted flag)
 * - Automatic timestamps (createdAt, updatedAt)
 */

const departmentSchema = new mongoose.Schema(
  {
    // Public ID (safe for frontend use, auto-generated)
    code: {
      type: String,
      unique: true,
      index: true,
      default: () => "DEP-" + uuidv4().split("-")[0].toUpperCase(),
    },

    // Department name - required and must be unique
    name: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
    },

    // Optional description for the department
    description: {
      type: String,
      trim: true,
    },

    // Reference to User model - the head of this department
    department_head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Department status - can be ACTIVE or INACTIVE
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    // Audit fields - track who created this department
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Audit fields - track who last updated this department
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Soft delete flag - instead of deleting, we mark as deleted
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,

    // Transform output when converting to JSON (API responses)
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id; // Hide MongoDB internal _id from API responses
        delete ret.__v; // Hide version key from API responses
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

// Index for faster queries on name and status
departmentSchema.index({ name: 1, status: 1 });

// Index for faster queries on isDeleted (to filter out soft-deleted records)
departmentSchema.index({ isDeleted: 1 });

export default mongoose.model("Department", departmentSchema);
