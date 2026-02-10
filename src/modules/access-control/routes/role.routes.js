import express from "express";
import { getRoles, getRole } from "../controllers/role.controller.js";
import { protect, authorize } from "../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../utils/constants.js";

const router = express.Router();

// View all predefined roles
router.get("/roles", protect, authorize(ROLES.ADMINISTRATOR), getRoles);

// View a single role (permissions)
router.get("/roles/:id", protect, authorize(ROLES.ADMINISTRATOR), getRole);

export default router;
