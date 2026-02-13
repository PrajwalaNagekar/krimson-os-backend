import mongoose from "mongoose";

const TermSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    curriculumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CurriculumFramework",
        required: true
    }
}, { timestamps: true });


TermSchema.index({ academicYear: 1 });

TermSchema.plugin(auditPlugin);

export const Term = mongoose.model("Term", TermSchema);