import express from "express";
import {
  getLibrarians,
  getLibrarian,
  createLibrarian,
  updateLibrarian,
  deleteLibrarian,
} from "../controllers/librarian.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize(ROLES.ADMINISTRATOR, ROLES.LIBRARIAN), getLibrarians)
  .post(protect, authorize(ROLES.ADMINISTRATOR), createLibrarian);

router
  .route("/:id")
  .get(protect, getLibrarian)
  .put(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.LIBRARIAN),
    updateLibrarian
  )
  .delete(protect, authorize(ROLES.ADMINISTRATOR), deleteLibrarian);

export default router;
