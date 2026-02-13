import mongoose from "mongoose";
const LessonPlanSchema = new mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        unique: true
    },
    curriculumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CurriculumFramework",
        required: true,
        index: true
    },
    projectPrompt: String,
    labActivity: String,
    observationGuide: String,
    inferenceQuestions: String,
    conceptExplanation: String,
    applicationTask: String,
    reflectionPrompt: String,

    materials: [String],

    differentiation: {
        remedial: [String],
        enrichment: [String]
    },

    publishedAt: Date
}, { timestamps: true });


export const LessonPlan = mongoose.model("LessonPlan", LessonPlanSchema);