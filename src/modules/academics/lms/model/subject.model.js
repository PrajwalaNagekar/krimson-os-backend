import mongoose from "mongoose";
import { auditPlugin } from "../../../../utils/auditPlugin.js";

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    code: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },

    curriculumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CurriculumFramework",
        required: true,
        index: true
    },

    status: {
        type: String,
        enum: ["DRAFT", "APPROVED", "LOCKED"],
        default: "DRAFT"
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

SubjectSchema.plugin(auditPlugin);

// unique subject per curriculum
SubjectSchema.index(
    { code: 1, curriculumId: 1 },
    { unique: true }
);

export const Subject = mongoose.model("Subject", SubjectSchema);
