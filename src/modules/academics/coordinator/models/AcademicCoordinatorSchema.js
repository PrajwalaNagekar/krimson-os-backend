import mongoose from "mongoose";

const academicCoordinatorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    coordination_scope: {
      departments: [{ type: String, required: true }],
      grades: [{ type: String }],
      academic_years: [{ type: String, required: true }],
    },
    operational_scope: {
      curriculum_alignment: { type: Boolean, default: true },
      lesson_plan_review: { type: Boolean, default: true },
      assessment_moderation: { type: Boolean, default: true },
      timetable_coordination: { type: Boolean, default: true },
      teacher_mentoring: { type: Boolean, default: true },
    },
    approval_scope: {
      requires_principal_signoff: { type: Boolean, default: false },
    },
    delegated_coordinators: [
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
        enum: ["overview", "lesson_plans", "timetable", "assessments"],
        default: "overview",
      },
    },
    created_by: { type: String, default: "SYSTEM" },
    updated_by: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("AcademicCoordinator", academicCoordinatorSchema);
