import express from "express";
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";
import { protect, authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL, ROLES.REGISTRAR),
    getStudents
  )
  .post(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.REGISTRAR),
    createStudent
  );

router
  .route("/:id")
  .get(protect, getStudent)
  .put(protect, authorize(ROLES.ADMINISTRATOR, ROLES.REGISTRAR), updateStudent)
  .delete(protect, authorize(ROLES.ADMINISTRATOR), deleteStudent);

export default router;
