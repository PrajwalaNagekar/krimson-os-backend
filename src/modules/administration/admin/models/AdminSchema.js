import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    admin_type: {
      type: String,
      enum: ["SUPER_ADMIN", "SYSTEM_ADMIN", "SUPPORT_ADMIN"],
      required: true,
      index: true,
    },
    security_controls: {
      mfa_enforced: { type: Boolean, default: true },
      ip_whitelist_enabled: { type: Boolean, default: false },
      session_timeout_minutes: { type: Number, default: 30 },
    },
    operational_scope: {
      user_lifecycle: { type: Boolean, default: true },
      system_configuration: { type: Boolean, default: false },
      incident_management: { type: Boolean, default: true },
      data_exports: { type: Boolean, default: false },
    },
    escalation_contact: { type: Boolean, default: false },
    dashboard_preferences: {
      widgets_layout: [{ type: String }],
      default_view: {
        type: String,
        enum: ["overview", "users", "system", "logs"],
        default: "overview",
      },
    },
    created_by: { type: String, default: "SYSTEM" },
    updated_by: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Admin", adminSchema);
