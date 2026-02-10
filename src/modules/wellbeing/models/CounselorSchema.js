import mongoose from "mongoose";

const counselorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    specialization: String,
    credentials: [
      {
        title: String,
        issued_by: String,
        valid_until: Date,
      },
    ],
    caseload: {
      max_active_cases: { type: Number, default: 30 },
      current_active_cases: { type: Number, default: 0 },
    },
    assigned_grades: [{ type: String }],
    safeguarding_scope: {
      mandatory_reporting: { type: Boolean, default: true },
      escalation_required: { type: Boolean, default: true },
    },
    delegated_counselors: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        valid_from: Date,
        valid_to: Date,
      },
    ],
    dashboard_preferences: {
      widgets_layout: [{ type: String }],
      default_view: {
        type: String,
        enum: ["cases", "interventions", "analytics", "reports"],
        default: "cases",
      },
    },
    created_by: { type: String, default: "SYSTEM" },
    updated_by: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Counselor", counselorSchema);
