import express from "express";
import {
  getITAdmins,
  getITAdmin,
  createITAdmin,
  updateITAdmin,
  deleteITAdmin,
} from "../controllers/itAdmin.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize(ROLES.ADMINISTRATOR, ROLES.IT_ADMIN), getITAdmins)
  .post(protect, authorize(ROLES.ADMINISTRATOR, ROLES.IT_ADMIN), createITAdmin);

router
  .route("/:id")
  .get(protect, getITAdmin)
  .put(protect, authorize(ROLES.ADMINISTRATOR, ROLES.IT_ADMIN), updateITAdmin)
  .delete(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.IT_ADMIN),
    deleteITAdmin
  );

export default router;
