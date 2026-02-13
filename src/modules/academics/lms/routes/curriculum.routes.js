import express from "express";
import { curriculumController } from "../controller/curriculum.controller.js";
import { protect } from "../../../../core/auth/auth.middleware.js";
import validate from "../../../../middlewares/validationMiddleware.js";
import { createCurriculumSchema } from "../validators/curriculum.validators.js";
import { authorize } from "../../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../../utils/constants.js";
const router = express.Router();

router.post("/", protect, authorize(ROLES.ADMINISTRATOR), validate(createCurriculumSchema), curriculumController.createCurriculumFramework);
router.get("/all-curriculums", protect, curriculumController.getCurriculums);
router.get("/get-curriculum/:id", authorize(ROLES.ADMINISTRATOR, ROLES.PARENT, ROLES.STUDENT), protect, curriculumController.getCurriculumById);
router.patch("/update-curriculum/:id", protect, curriculumController.updateCurriculumFramework);

export default router;