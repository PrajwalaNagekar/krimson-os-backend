import mongoose from "mongoose";
const LessonSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },
    title: { type: String },
    plannedDate: Date,
    estimatedDuration: Number,
    status: {
        type: String,
        enum: ["DRAFT", "PUBLISHED", "TAUGHT"],
        default: "DRAFT"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

LessonSchema.index({ topicId: 1 });
LessonSchema.index({ plannedDate: 1 });
LessonSchema.plugin(auditPlugin);

export const CurriculumApproval = mongoose.model("CurriculumApproval", CurriculumApprovalSchema);