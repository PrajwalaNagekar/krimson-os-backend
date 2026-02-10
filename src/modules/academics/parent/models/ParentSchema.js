import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    children: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        relationship: {
          type: String,
          enum: ["father", "mother", "guardian"],
          required: true,
        },
        is_primary_guardian: { type: Boolean, default: false },
        can_pickup: { type: Boolean, default: true },
        financial_responsibility: { type: Boolean, default: false },
      },
    ],
    consent: {
      pdpa_signed: { type: Boolean, default: false },
      consent_signed_at: Date,
      consent_version: String,
    },
    billing_address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      postal_code: String,
    },
    payment_profiles: [
      {
        provider: {
          type: String,
          enum: ["STRIPE", "RAZORPAY"],
          required: true,
        },
        external_customer_id: { type: String, required: true },
        is_default: { type: Boolean, default: false },
      },
    ],
    notification_preferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
    },
    created_by: { type: String, default: "SYSTEM" },
    updated_by: { type: String, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Parent", parentSchema);
