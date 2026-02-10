import express from "express";
import {
  getFinanceOfficers,
  getFinanceOfficer,
  createFinanceOfficer,
  updateFinanceOfficer,
  deleteFinanceOfficer,
} from "../controllers/finance.controller.js";
import { protect, authorize } from "../../../core/auth/auth.middleware.js";
import { ROLES } from "../../../utils/constants.js";

const router = express.Router();

router
  .route("/")
  .get(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.FINANCE_OFFICER),
    getFinanceOfficers
  )
  .post(protect, authorize(ROLES.ADMINISTRATOR), createFinanceOfficer);

router
  .route("/:id")
  .get(protect, getFinanceOfficer)
  .put(
    protect,
    authorize(ROLES.ADMINISTRATOR, ROLES.FINANCE_OFFICER),
    updateFinanceOfficer
  )
  .delete(protect, authorize(ROLES.ADMINISTRATOR), deleteFinanceOfficer);

export default router;
