import express from "express";
import {
  getManagementMembers,
  getManagementMember,
  createManagementMember,
  updateManagementMember,
  deleteManagementMember,
} from "../controllers/management.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.MANAGEMENT),
    getManagementMembers
  )
  .post(protect, authorize(ROLES.ADMINISTRATOR), createManagementMember);

router
  .route("/:id")
  .get(protect, getManagementMember)
  .put(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.MANAGEMENT),
    updateManagementMember
  )
  .delete(protect, authorize(ROLES.ADMINISTRATOR), deleteManagementMember);

export default router;
