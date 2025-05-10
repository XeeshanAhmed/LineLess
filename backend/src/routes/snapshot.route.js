import express from "express";
import { getSnapshotData } from "../controllers/snapshot.controller.js";

const router = express.Router();

router.get("/:businessId/:departmentId/:userId", getSnapshotData);

export default router;
