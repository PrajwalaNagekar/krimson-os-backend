import mongoose from "mongoose";

const principalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    years_active: { type: Number, min: 0 },
    appointment_date: Date,
    authority_scope: {
      academic: { type: Boolean, default: true },
      finance: { type: Boolean, default: true },
      compliance: { type: Boolean, default: true },
      hr: { type: Boolean, default: true },
    },
    compliance_signatory: { type: Boolean, default: true },
    delegated_authorities: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        scope: {
          type: String,
          enum: ["academic", "finance", "compliance", "hr"],
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

export default mongoose.model("Principal", principalSchema);
