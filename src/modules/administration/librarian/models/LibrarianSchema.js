import mongoose from "mongoose";

const librarianSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    assigned_sections: [{ type: String, required: true }],
    operational_scope: {
      can_manage_inventory: { type: Boolean, default: true },
      can_process_issue_return: { type: Boolean, default: true },
      can_recommend_fines: { type: Boolean, default: true },
    },
    last_inventory_audit_at: Date,
    dashboard_preferences: {
      widgets_layout: [{ type: String }],
      default_view: {
        type: String,
        enum: ["inventory", "issues", "overdue", "reports"],
        default: "inventory",
      },
    },
    created_by: { type: String, default: "SYSTEM" },
    updated_by: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Librarian", librarianSchema);
