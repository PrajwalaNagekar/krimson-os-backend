import mongoose from "mongoose";

const financeOfficerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    responsibility_scope: {
      fee_management: { type: Boolean, default: true },
      invoicing: { type: Boolean, default: true },
      refunds_processing: { type: Boolean, default: false },
      reconciliation: { type: Boolean, default: true },
      reporting: { type: Boolean, default: true },
    },
    payment_gateways: [
      {
        provider: {
          type: String,
          enum: ["RAZORPAY", "STRIPE"],
          required: true,
        },
        is_primary: { type: Boolean, default: false },
      },
    ],
    approval_scope: {
      max_refund_amount: Number,
      requires_principal_approval: { type: Boolean, default: true },
    },
    dashboard_preferences: {
      widgets_layout: [{ type: String }],
      default_view: {
        type: String,
        enum: ["collections", "invoices", "refunds", "reports"],
        default: "collections",
      },
    },
    created_by: { type: String, default: "SYSTEM" },
    updated_by: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("FinanceOfficer", financeOfficerSchema);
