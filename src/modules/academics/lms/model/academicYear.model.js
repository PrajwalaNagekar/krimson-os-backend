import mongoose from "mongoose";
import { auditPlugin } from "../../../../utils/auditPlugin.js";

const AcademicYearSchema = new mongoose.Schema({

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: "End date must be greater than start date"
        }
    },

    status: {
        type: String,
        enum: ["PLANNING", "ACTIVE", "CLOSED"],
        default: "PLANNING"
    },

    isLocked: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

// Apply global audit plugin
AcademicYearSchema.plugin(auditPlugin);

export const AcademicYear = mongoose.model("AcademicYear", AcademicYearSchema);
