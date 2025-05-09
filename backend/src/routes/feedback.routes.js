import express from "express";
import {
  submitFeedback,
  getFeedbackForDepartment,
} from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/submit", submitFeedback);
router.get("/:businessId/:departmentId", getFeedbackForDepartment);

export default router;
