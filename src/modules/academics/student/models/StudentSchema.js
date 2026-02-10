import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    admission_number: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    dob: Date,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    nationality: { type: String, required: true, index: true },
    enrollment_status: {
      type: String,
      enum: [
        "inquiry",
        "applied",
        "active",
        "suspended",
        "withdrawn",
        "graduated",
      ],
      default: "inquiry",
      index: true,
    },
    current_class_section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSection",
      index: true,
    },
    academic_history: [
      {
        academic_year: { type: String, required: true },
        class_section: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ClassSection",
          required: true,
        },
        roll_number: String,
        status: {
          type: String,
          enum: ["active", "promoted", "repeated", "withdrawn"],
          required: true,
        },
      },
    ],
    house_team: String,
    external_accounts: [
      {
        provider: {
          type: String,
          enum: [
            "SKOLARO",
            "EXTRAMARKS",
            "WORDSWORTH",
            "XPERIMENTOR",
            "MOODLE",
            "TATA_CLASSEDGE",
          ],
          required: true,
        },
        external_student_id: { type: String, required: true },
        sync_status: {
          type: String,
          enum: ["linked", "syncing", "error"],
          default: "linked",
        },
        last_synced_at: Date,
      },
    ],
    parents: [
      {
        parent: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Parent",
          required: true,
        },
        relationship: {
          type: String,
          enum: ["father", "mother", "guardian"],
          required: true,
        },
        is_primary: { type: Boolean, default: false },
      },
    ],
    behavior_points: { type: Number, default: 0 },
    wallet_balance: { type: Number, default: 0 },
    created_by: { type: String, default: "SYSTEM" },
    updated_by: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Student", studentSchema);
