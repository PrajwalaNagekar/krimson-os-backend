import express from "express";
import {
  assignRoleToUser,
  getAllUsersWithRoles,
  getUserByIdentifier,
  editUser,
  suspendUser,
  unsuspendUser,
} from "../controllers/userManagement.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

/**
 * User Management Routes for Administration
 * All routes require ADMINISTRATOR role
 */

// POST /api/v1/administration/users/assign-role - Assign role to user (create if needed)
// app.use(protect)
router.post(
  "/assign-role",
  protect,
  authorize(ROLES.ADMINISTRATOR),
  assignRoleToUser
);

// GET /api/v1/administration/users - Get all users with roles
router.get("/", protect, authorize(ROLES.ADMINISTRATOR), getAllUsersWithRoles);

// GET /api/v1/administration/users/:identifier - Get user by id/email/ssomail
router.get(
  "/:identifier",
  protect,
  authorize(ROLES.ADMINISTRATOR),
  getUserByIdentifier
);

// PUT /api/v1/administration/users/:identifier - Edit user by id/email/ssomail
router.put("/:identifier", protect, authorize(ROLES.ADMINISTRATOR), editUser);

// PATCH /api/v1/administration/users/suspend - Suspend user
router.patch("/suspend", protect, authorize(ROLES.ADMINISTRATOR), suspendUser);

// PATCH /api/v1/administration/users/unsuspend - Unsuspend user
router.patch(
  "/unsuspend",
  protect,
  authorize(ROLES.ADMINISTRATOR),
  unsuspendUser
);

export default router;
