import mongoose from "mongoose";
const TopicSchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true
    },
    curriculumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CurriculumFramework",
        required: true,
        index: true
    },
    title: { type: String, required: true },
    estimatedPeriods: { type: Number, default: 1 },
    order: { type: Number }
}, { timestamps: true });

TopicSchema.index({ chapterId: 1 });
TopicSchema.plugin(auditPlugin);
export const Topic = mongoose.model("Topic", TopicSchema);