import express from "express";
import {
  getParents,
  getParent,
  createParent,
  updateParent,
  deleteParent,
} from "../controllers/parent.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { allowSelfParent } from "../../../../core/auth/selfAccess.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.REGISTRAR), // Removed PRINCIPAL
    getParents
  )
  .post(protect, authorize(ROLES.ADMINISTRATOR, ROLES.REGISTRAR), createParent);

router
  .route("/:id")
  .get(protect, allowSelfParent, getParent) // Allow self-access for parents
  .put(protect, authorize(ROLES.ADMINISTRATOR, ROLES.REGISTRAR), updateParent)
  .delete(protect, authorize(ROLES.ADMINISTRATOR), deleteParent);

export default router;
