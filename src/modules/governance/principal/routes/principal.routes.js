import express from "express";
import {
  getPrincipals,
  getPrincipal,
  createPrincipal,
  updatePrincipal,
  deletePrincipal,
} from "../controllers/principal.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize(ROLES.ADMINISTRATOR, ROLES.MANAGEMENT), getPrincipals)
  .post(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.MANAGEMENT),
    createPrincipal
  );

router
  .route("/:id")
  .get(protect, getPrincipal)
  .put(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.MANAGEMENT),
    updatePrincipal
  )
  .delete(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.MANAGEMENT),
    deletePrincipal
  );

export default router;
