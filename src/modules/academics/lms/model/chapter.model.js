import mongoose from "mongoose";
const ChapterSchema = new mongoose.Schema({
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: true
    },
    curriculumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CurriculumFramework",
        required: true,
        index: true
    },
    title: { type: String, required: true },
    order: { type: Number }
}, { timestamps: true });

ChapterSchema.index({ unitId: 1 });
ChapterSchema.plugin(auditPlugin);
export const Chapter = mongoose.model("Chapter", ChapterSchema);