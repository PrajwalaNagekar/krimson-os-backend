import mongoose from "mongoose";
const LessonOutcomeMapSchema = new mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true
    },
    outcomeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningOutcome",
        required: true
    },
    masteryCriteria: String
}, { timestamps: true });

LessonOutcomeMapSchema.index({ lessonId: 1, outcomeId: 1 }, { unique: true });

export const LessonOutcomeMap = mongoose.model("LessonOutcomeMap", LessonOutcomeMapSchema);