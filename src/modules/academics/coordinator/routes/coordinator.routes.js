import express from "express";
import {
  getCoordinators,
  getCoordinator,
  createCoordinator,
  updateCoordinator,
  deleteCoordinator,
} from "../controllers/coordinator.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL),
    getCoordinators
  )
  .post(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL),
    createCoordinator
  );

router
  .route("/:id")
  .get(protect, getCoordinator)
  .put(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL),
    updateCoordinator
  )
  .delete(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL),
    deleteCoordinator
  );

export default router;
