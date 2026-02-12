import mongoose from "mongoose";

const CurriculumFrameworkSchema = new mongoose.Schema({
    name: { type: String, required: true },
    authority: { type: String }, // CBSE, IB, Cambridge
    code: { type: String, unique: true }, // NCERT, CBE
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

CurriculumFrameworkSchema.index({ code: 1 });

export const CurriculumFramework = mongoose.model("CurriculumFramework", CurriculumFrameworkSchema);