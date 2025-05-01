import express from 'express';
import { businessLogin, businessSignUp } from '../controllers/authBusiness.controller.js';

const router = express.Router();

router.post('/signup', businessSignUp);
router.post('/login', businessLogin);

export default router;
