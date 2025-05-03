import express from "express";
import { login, signUp,getLoggedInUser } from "../controllers/authUser.controller.js";


const router=express.Router();

router.post('/signup',signUp);
router.post('/login',login);
router.get('/me', getLoggedInUser);

export default router;
