import express from "express";
import {
  getCounselors,
  getCounselor,
  createCounselor,
  updateCounselor,
  deleteCounselor,
} from "../controllers/counselor.controller.js";
import { protect, authorize } from "../../../core/auth/auth.middleware.js";
import { allowSelfCounselor } from "../../../core/auth/selfAccess.middleware.js";
import { ROLES } from "../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize(ROLES.PRINCIPAL), getCounselors) // Only Principal can list
  .post(protect, authorize(ROLES.ADMINISTRATOR), createCounselor);

router
  .route("/:id")
  .get(
    protect,
    authorize(ROLES.COUNSELOR, ROLES.PRINCIPAL), // Counselor (self) + Principal
    allowSelfCounselor, // Enforce self-access for counselors
    getCounselor
  )
  .put(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.COUNSELOR),
    updateCounselor
  )
  .delete(protect, authorize(ROLES.ADMINISTRATOR), deleteCounselor);

export default router;
