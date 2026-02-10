import express from "express";
import {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL, ROLES.ACADEMIC_COORDINATOR),
    getTeachers
  )
  .post(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL),
    createTeacher
  );

router
  .route("/:id")
  .get(protect, getTeacher)
  .put(protect, authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL), updateTeacher)
  .delete(protect, authorize(ROLES.ADMINISTRATOR), deleteTeacher);

export default router;
