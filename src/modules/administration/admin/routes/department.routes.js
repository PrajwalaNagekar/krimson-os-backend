import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

/**
 * Department Routes for Administration
 *
 * All routes require authentication (protect middleware)
 * All routes require ADMINISTRATOR role (authorize middleware)
 *
 * Routes:
 * - POST   /api/v1/administration/departments          - Create department
 * - GET    /api/v1/administration/departments          - Get all departments (with search/filter)
 * - GET    /api/v1/administration/departments/:id      - Get department by ID
 * - PUT    /api/v1/administration/departments/:id      - Update department
 * - DELETE /api/v1/administration/departments/:id      - Delete department (soft delete)
 */

// POST /api/v1/administration/departments - Create a new department
router.post("/", protect, authorize(ROLES.ADMINISTRATOR), createDepartment);

// GET /api/v1/administration/departments - Get all departments with search/filter
router.get("/", protect, authorize(ROLES.ADMINISTRATOR), getDepartments);

// GET /api/v1/administration/departments/:id - Get department by ID
router.get("/:id", protect, authorize(ROLES.ADMINISTRATOR), getDepartmentById);

// PUT /api/v1/administration/departments/:id - Update department
router.put("/:id", protect, authorize(ROLES.ADMINISTRATOR), updateDepartment);

// DELETE /api/v1/administration/departments/:id - Soft delete department
router.delete(
  "/:id",
  protect,
  authorize(ROLES.ADMINISTRATOR),
  deleteDepartment,
);

export default router;
