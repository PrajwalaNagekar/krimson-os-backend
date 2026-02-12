import express from "express";
import { curriculumController } from "../controller/curriculum.controller.js";
import { protect } from "../../../../core/auth/auth.middleware.js";
const router = express.Router();

router.post("/create-curriculum-framework", protect, curriculumController.createCurriculumFramework);

export default router;
