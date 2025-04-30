import express from "express";
import { login, signUp } from "../controllers/authUser.controller.js";


const router=express.Router();

router.post('/signup',signUp);
router.post('/login',login);

export default router;
