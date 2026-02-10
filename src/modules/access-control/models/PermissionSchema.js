import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["CREATE", "READ", "UPDATE", "DELETE", "APPROVE", "EXPORT"],
    },
    description: {
      type: String,
    },
    is_sensitive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Permission", permissionSchema);
