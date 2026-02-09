import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ROLES } from "../../../utils/constants.js";
import bcrypt from "bcryptjs";
import "./role.model.js"; // Ensure Role schema is registered before User uses logic that might populate it

const userSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,

            unique: true,
            index: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        full_name: {
            type: String,
            trim: true,
        },
        password_hash: {
            type: String,
            required: true,
        },
        active_role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.STUDENT,
            required: true,
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
        roles: {
            type: [String],
            enum: Object.values(ROLES),
            default: [],
        },
        passwordResetOTP: String,
        passwordResetOTPExpire: Date,
        passwordResetOTPVerified: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },

        last_login_at: {
            type: Date,
            default: null,
        },
        avatar_url: {
            type: String,
            default: null,
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

    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password_hash);
};

// ✅ SAFE MODEL EXPORT (fixes OverwriteModelError)
const User = mongoose.model("User", userSchema);

export default User;
