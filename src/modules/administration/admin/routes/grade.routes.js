import express from "express";
import { createGrade, getGrades } from "../controllers/grade.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

/**
 * Grade Routes for Administration
 *
 * All routes require authentication (protect middleware)
 * All routes require ADMINISTRATOR role (authorize middleware)
 *
 * Routes:
 * - POST   /api/v1/administration/grades          - Create grade
 * - GET    /api/v1/administration/grades          - Get all grades (with pagination/search)
 */

// POST /api/v1/administration/grades - Create a new grade
router.post("/", protect, authorize(ROLES.ADMINISTRATOR), createGrade);

// GET /api/v1/administration/grades - Get all grades with pagination and search
router.get("/", protect, authorize(ROLES.ADMINISTRATOR), getGrades);

export default router;
