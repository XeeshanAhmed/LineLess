import express from "express";
import { resetTokenCounter } from "../controllers/tokenCounter.controller.js";

const router = express.Router();

router.post("/reset", resetTokenCounter);

export default router;
