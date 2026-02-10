import mongoose from "mongoose";

const managementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    board_role: {
      type: String,
      enum: ["TRUSTEE", "DIRECTOR", "CHAIRPERSON", "ADVISOR"],
      required: true,
      index: true,
    },
    appointment_date: Date,
    tenure_end_date: Date,
    oversight_scope: {
      academic_governance: { type: Boolean, default: true },
      financial_governance: { type: Boolean, default: true },
      compliance_governance: { type: Boolean, default: true },
      strategic_planning: { type: Boolean, default: true },
    },
    reporting_preferences: {
      frequency: {
        type: String,
        enum: ["monthly", "quarterly", "annual"],
        default: "quarterly",
      },
      receives_board_reports: { type: Boolean, default: true },
    },
    delegated_representatives: [
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
        enum: ["overview", "academics", "finance", "compliance"],
        default: "overview",
      },
    },
    created_by: { type: String, default: "SYSTEM" },
    updated_by: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Management", managementSchema);
