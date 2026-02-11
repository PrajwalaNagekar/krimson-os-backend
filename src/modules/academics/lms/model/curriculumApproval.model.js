import mongoose from "mongoose";

const CurriculumApprovalSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
        unique: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    approvedAt: Date,
    status: {
        type: String,
        enum: ["PENDING", "APPROVED"]
    }
}, { timestamps: true });


export const CurriculumApproval = mongoose.model("CurriculumApproval", CurriculumApprovalSchema);