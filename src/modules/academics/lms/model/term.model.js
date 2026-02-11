import mongoose from "mongoose";

const TermSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Term 1
    academicYear: { type: String, required: true }, // 2025-26
    startDate: Date,
    endDate: Date
}, { timestamps: true });

TermSchema.index({ academicYear: 1 });


export const Term = mongoose.model("Term", TermSchema);