import express from "express";
import {
  submitFeedback,
  getFeedbackForDepartment,
} from "../controllers/feedback.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/roleGuard.middleware.js";

const router = express.Router();

router.post("/submit",authenticate,authorizeRoles("user"), submitFeedback);
router.get("/:businessId/:departmentId",authenticate,authorizeRoles("user","business"), getFeedbackForDepartment);

export default router;
