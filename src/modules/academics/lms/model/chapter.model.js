import mongoose from "mongoose";
const ChapterSchema = new mongoose.Schema({
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: true
    },
    title: { type: String, required: true },
    order: { type: Number }
}, { timestamps: true });

ChapterSchema.index({ unitId: 1 });
export const Chapter = mongoose.model("Chapter", ChapterSchema);