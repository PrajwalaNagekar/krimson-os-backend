import mongoose from "mongoose";

/**
 * Enterprise Grade Schema
 * Production-Level Implementation
 *
 * Features:
 * - Academic year support (ACTIVE - uncommented for production use)
 * - Grade ordering system
 * - Promotion mapping (next grade)
 * - Partial unique index (handles soft delete correctly)
 * - Auto soft-delete filtering
 * - Capacity management
 * - Audit tracking
 *
 * FUTURE INTEGRATION:
 * - Subject model (modules/academics/lms/model/subject.model.js) currently uses
 *   grades: [{ type: Number }] for grade levels. In the future, this could be
 *   updated to reference Grade documents for better data consistency.
 */

const gradeSchema = new mongoose.Schema(
  {
    /**
     * Academic Year Reference
     * CURRENT: Plain string for manual entry (e.g., "2024-2025", "2025-2026")
     *
     * FUTURE INTEGRATION (uncomment when AcademicYear model is ready):
     * Uncomment the lines below to enable dynamic ObjectId reference
     */
    academicYearId: {
      type: String, // TEMPORARY: Will be ObjectId with ref in future
      required: true,
      index: true,
      trim: true,
    },

    /* FUTURE: Uncomment this block when AcademicYear model is implemented
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
      index: true,
    },
    */

    /**
     * Grade Name (Display Name)
     * Example: "Grade 9", "Class 10", "Kindergarten"
     */
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    /**
     * Normalized Name (Auto Generated)
     * Used for case-insensitive uniqueness
     */
    normalizedName: {
      type: String,
      trim: true,
      lowercase: true,
    },

    /**
     * Optional Grade Code
     * Example: G9, K1
     */
    code: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
    },

    /**
     * Display Order (Important for promotion & sorting)
     */
    order: {
      type: Number,
      required: true,
      min: 1,
    },

    /**
     * Default Student Capacity
     */
    defaultCapacity: {
      type: Number,
      required: true,
      min: 1,
      default: 30,
    },

    /**
     * Whether grade contains sections
     */
    hasSections: {
      type: Boolean,
      default: true,
    },

    /**
     * Cached Section Count (optional optimization)
     */
    totalSections: {
      type: Number,
      default: 0,
      min: 0,
    },

    /**
     * Subjects Associated with this Grade
     * Optional array of Subject references
     * Can be added, updated, or deleted as needed
     *
     * NOTE: Subject model (modules/academics/lms/model/subject.model.js) has
     * a 'grades' field using numbers. In the future, you may want to synchronize:
     * - This Grade.subjects array (ObjectId references)
     * - Subject.grades array (number array)
     *
     * For now, this allows flexible subject assignment per grade.
     */
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],

    /**
     * Teachers Assigned to this Grade (OPTIONAL)
     * Multiple teachers can be assigned to one grade
     * References the User model (teachers have role: "TEACHER")
     *
     * NOT REQUIRED during grade creation - teachers can be:
     * - Added later via update operations
     * - Edited/modified at any time
     * - Removed when needed
     */
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /**
     * Promotion Mapping
     * Points to next grade
     */
    nextGradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
      default: null,
    },

    /**
     * Whether students can be promoted
     */
    isPromotable: {
      type: Boolean,
      default: true,
    },

    /**
     * Grade Status
     */
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "ARCHIVED"],
      default: "ACTIVE",
      index: true,
    },

    /**
     * Audit Fields
     */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /**
     * Soft Delete Timestamp
     */
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

/* =========================================================
   INDEXES (Enterprise Optimized)
========================================================= */

/**
 * Unique grade per academic year (ignoring soft deleted)
 */
gradeSchema.index(
  { academicYearId: 1, normalizedName: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
  },
);

/**
 * Optional unique code per academic year
 */
gradeSchema.index(
  { academicYearId: 1, code: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { deletedAt: null },
  },
);

/**
 * Fast sorting by order
 */
gradeSchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.normalizedName = this.name.toLowerCase();
  }
});

/**
 * Automatically exclude soft-deleted records from queries
 * Using explicit hooks instead of regex pattern for better compatibility
 */
gradeSchema.pre("find", function () {
  this.where({ deletedAt: null });
});

gradeSchema.pre("findOne", function () {
  this.where({ deletedAt: null });
});

gradeSchema.pre("findOneAndUpdate", function () {
  this.where({ deletedAt: null });
});

gradeSchema.pre("count", function () {
  this.where({ deletedAt: null });
});

gradeSchema.pre("countDocuments", function () {
  this.where({ deletedAt: null });
});

export default mongoose.models.Grade || mongoose.model("Grade", gradeSchema);
