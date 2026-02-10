import express from "express";
import {
  getRegistrars,
  getRegistrar,
  createRegistrar,
  updateRegistrar,
  deleteRegistrar,
} from "../controllers/registrar.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL), getRegistrars)
  .post(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL),
    createRegistrar
  );

router
  .route("/:id")
  .get(protect, getRegistrar)
  .put(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL),
    updateRegistrar
  )
  .delete(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL),
    deleteRegistrar
  );

export default router;
