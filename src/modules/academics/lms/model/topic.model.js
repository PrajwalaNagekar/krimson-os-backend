import mongoose from "mongoose";
const TopicSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true
    },
    title: { type: String, required: true },
    estimatedPeriods: { type: Number, default: 1 },
    order: { type: Number }
}, { timestamps: true });

TopicSchema.index({ chapterId: 1 });

export const Topic = mongoose.model("Topic", TopicSchema);