import mongoose from "mongoose";
const LearningOutcomeSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },
    statement: { type: String, required: true },
    bloomLevel: {
        type: String,
        enum: ["REMEMBER", "UNDERSTAND", "APPLY", "ANALYZE", "EVALUATE", "CREATE"]
    },
    competencyTypes: [{
        type: String,
        enum: ["Knowledge", "Skill", "Application", "Value"]
    }],
    frameworkCode: { type: String }, // NCERT-6-SCI-01
}, { timestamps: true });

LearningOutcomeSchema.index({ topicId: 1 });
LearningOutcomeSchema.index({ frameworkCode: 1 });

export const LearningOutcome = mongoose.model("LearningOutcome", LearningOutcomeSchema);

