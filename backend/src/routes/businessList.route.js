import express from "express";
import { getAllBusinessesWithDepartments } from "../controllers/businessList.controller.js";

const router = express.Router();

router.get("/list", getAllBusinessesWithDepartments);

export default router;
