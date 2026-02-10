import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ROLES, HTTP_STATUS } from "../../../utils/constants.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    full_name: {
      type: String,
      required: [true, "Please provide a full name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    password_hash: {
      type: String,
      required: true,
    },
    active_role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      default: ROLES.STUDENT,
    },

    role_data: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role", // Links to your new RoleSchema
      default: null,
    },
    // Keep 'active_role' for quick frontend checks, but use 'role_data' for backend permissions
    roles: {
      type: [String],
      enum: Object.values(ROLES),
      default: [],
    },
    // OTP-based password reset (replaces insecure token-based system)
    passwordResetOTP: String, // Hashed OTP
    passwordResetOTPExpire: Date, // 24-hour expiry
    passwordResetOTPVerified: { type: Boolean, default: false }, // Tracks if OTP was verified
    app_access: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    mfa_enabled: {
      type: Boolean,
      default: false,
    },
    sso_provider: {
      type: String,
      default: null,
    },
    last_login_at: {
      type: Date,
      default: null,
    },
    avatar_url: {
      type: String,
      default: null,
    },
    timezone: {
      type: String,
      default: "SGT",
    },
    created_by: {
      type: String,
      default: "SYSTEM",
    },
    updated_by: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

const User = mongoose.model("User", userSchema);
export default User;
