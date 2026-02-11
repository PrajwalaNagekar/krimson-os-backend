import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { seedPermissions } from "./seedPermissions.js";
import { seedRoles } from "./seedRoles.js";
import { seedAdmin } from "./seedAdmin.js";

dotenv.config();

const runSeeds = async () => {
    try {
        console.log(" Starting database seeding...");

        await connectDB();

        console.log("--- Seeding Permissions ---");
        await seedPermissions();

        console.log("--- Seeding Roles ---");
        await seedRoles();

        console.log("--- Seeding Admin User ---");
        await seedAdmin();

        console.log(" Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error(" Seeding failed:");
        console.error(error);
        process.exit(1);
    }
};

runSeeds();
