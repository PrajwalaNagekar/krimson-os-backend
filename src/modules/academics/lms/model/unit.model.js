import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    termId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Term",
        required: true
    },
    title: { type: String, required: true },
    order: { type: Number },
    isLocked: { type: Boolean, default: false }
}, { timestamps: true });

UnitSchema.index({ subjectId: 1, termId: 1 });

export const Term = mongoose.model("Term", TermSchema);