import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    employee_id: { type: String, required: true, unique: true, index: true },
    designation: String,
    joining_date: Date,
    teaching_assignments: [
      {
        academic_year: { type: String, required: true },
        class_section: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ClassSection",
          required: true,
        },
        subject: { type: String, required: true },
        is_class_teacher: { type: Boolean, default: false },
      },
    ],
    tpi: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      last_calculated_at: Date,
    },
    last_audit_date: Date,
    external_accounts: [
      {
        provider: {
          type: String,
          enum: ["SKOLARO", "TATA_CLASSEDGE"],
          required: true,
        },
        external_staff_id: { type: String, required: true },
        last_synced_at: Date,
      },
    ],
    dashboard_preferences: {
      widgets_layout: [{ type: String }],
      default_view: {
        type: String,
        enum: ["classes", "attendance", "assignments", "analytics"],
        default: "classes",
      },
    },
    created_by: { type: String, default: "SYSTEM" },
    updated_by: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Teacher", teacherSchema);
