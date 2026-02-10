import express from "express";
import {
  createUser,
  getUsers,
} from "../../../controllers/admin/userManagementController.js";
import { protect, authorize } from "../../../middleware/authMiddleware.js";
import validate from "../../../middleware/validationMiddleware.js";
import { userValidators } from "../../../modules/administration/admin/validators/user.validator.js";
import { ROLES } from "../../../utils/constants.js";

const router = express.Router();

// Public routes (for now, or protect them)
// Typically creating a user (like a student) is an Admin function
router
  .route("/users")
  .post(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL),
    validate(userValidators.createUser),
    createUser
  )
  .get(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.PRINCIPAL, ROLES.TEACHER),
    getUsers
  ); // Added protection defaults

export default router;
