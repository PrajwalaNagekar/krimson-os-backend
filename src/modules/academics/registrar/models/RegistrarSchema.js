import mongoose from "mongoose";

const registrarSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    assignment_scope: {
      grades: [{ type: String, required: true }],
      sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "ClassSection" }],
      academic_years: [{ type: String, required: true }],
    },
    operational_scope: {
      admissions: { type: Boolean, default: true },
      student_records: { type: Boolean, default: true },
      withdrawals: { type: Boolean, default: true },
      transport_mapping: { type: Boolean, default: false },
      inventory_coordination: { type: Boolean, default: false },
    },
    compliance_scope: {
      can_prepare_documents: { type: Boolean, default: true },
      requires_principal_signoff: { type: Boolean, default: true },
    },
    is_primary_registrar: { type: Boolean, default: false },
    delegated_registrars: [
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
        enum: ["admissions", "records", "documents", "fees"],
        default: "admissions",
      },
    },
    created_by: { type: String, default: "SYSTEM" },
    updated_by: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Registrar", registrarSchema);
