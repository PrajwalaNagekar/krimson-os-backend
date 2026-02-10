import express from "express";
import { getDashboardStats } from "./analytics.controller.js";
import { protect, authorize } from "../../core/auth/auth.middleware.js";
import { ROLES } from "../../utils/constants.js";

const router = express.Router();

// Analytics routes (READ-ONLY)
router.get(
  "/dashboard-stats",
  protect,
  authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL),
  getDashboardStats
);

export default router;
