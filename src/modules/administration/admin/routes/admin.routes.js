import express from "express";
import {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize(ROLES.ADMINISTRATOR), getAdmins)
  .post(protect, authorize(ROLES.ADMINISTRATOR), createAdmin);

router
  .route("/:id")
  .get(protect, authorize(ROLES.ADMINISTRATOR), getAdmin)
  .put(protect, authorize(ROLES.ADMINISTRATOR), updateAdmin)
  .delete(protect, authorize(ROLES.ADMINISTRATOR), deleteAdmin);

export default router;
