import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    frameworkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CurriculumFramework",
        required: true
    },
    grades: [{ type: Number }],
    status: {
        type: String,
        enum: ["DRAFT", "APPROVED", "LOCKED"],
        default: "DRAFT"
    }
}, { timestamps: true });

SubjectSchema.index({ code: 1 });
SubjectSchema.index({ frameworkId: 1 });

export const Subject = mongoose.model("Subject", SubjectSchema);
