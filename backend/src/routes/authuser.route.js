import express from "express";
import { login, signUp,getLoggedInUser,logout } from "../controllers/authUser.controller.js";


const router=express.Router();

router.post('/signup',signUp);
router.post('/login',login);
router.get('/me', getLoggedInUser);
router.post('/logout', logout);

export default router;
