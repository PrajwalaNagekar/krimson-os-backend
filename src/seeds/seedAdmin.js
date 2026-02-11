import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../modules/identity/models/UserSchema.js";
import Role from "../modules/access-control/models/RoleSchema.js";

dotenv.config();

export const seedAdmin = async () => {
  try {
    const email = "prajwalanagekar@gmail.com";
    const password = "admin123";
    const roleCode = "R05";

    const adminRole = await Role.findOne({ code: roleCode });
    if (!adminRole) {
      throw new Error("Admin role not found. Run seedRoles first.");
    }

    const password_hash = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email },
      {
        full_name: "System Administrator",
        email,
        password_hash,

        // 🔐 Hybrid RBAC (safe)
        active_role: adminRole.name, // "ADMINISTRATOR"
        roles: [adminRole.name], // ["ADMINISTRATOR"]
        role_data: adminRole._id,

        status: "active",
        created_by: "SYSTEM",
      },
      { upsert: true, new: true }
    );

    console.log("✅ Admin user seeded (FINAL)");
  } catch (err) {
    console.error("❌ Admin seeding failed:", err.message);
    throw err;
  }
};


// seedAdmin();

