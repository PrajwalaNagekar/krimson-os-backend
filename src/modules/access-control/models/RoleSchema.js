import mongoose from "mongoose";
import "./PermissionSchema.js";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    description: String,

    // 🔴 REQUIRED FOR RBAC
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
        required: true,
      },
    ],

    is_system_role: {
      type: Boolean,
      default: false,
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
