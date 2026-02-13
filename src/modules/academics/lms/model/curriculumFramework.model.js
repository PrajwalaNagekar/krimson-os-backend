import mongoose from "mongoose";
import { auditPlugin } from "../../../../utils/auditPlugin.js";

const CurriculumFrameworkSchema = new mongoose.Schema({
    name: { type: String, required: true },

    authority: { type: String }, // CBSE, IB, Cambridge

    code: { type: String, },

    gradeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grade",
        required: true
    },
    academicYearId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicYear",
        required: true
    },

    status: {
        type: String,
        enum: ["DRAFT", "SUBMITTED", "APPROVED", "LOCKED"],
        default: "DRAFT"
    },

    isActive: { type: Boolean, default: true },

    isDeleted: { type: Boolean, default: false }

}, { timestamps: true });

// Apply global audit plugin
CurriculumFrameworkSchema.plugin(auditPlugin);

// Indexes
CurriculumFrameworkSchema.index(
    { academicYearId: 1, gradeId: 1, authority: 1 },
    { unique: true }
);

CurriculumFrameworkSchema.index({ status: 1 });

export const CurriculumFramework = mongoose.model("CurriculumFramework", CurriculumFrameworkSchema);
