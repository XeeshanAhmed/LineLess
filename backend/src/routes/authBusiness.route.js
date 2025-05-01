import express from 'express';
import { loginBusiness, signUpBusiness } from '../controllers/authBusiness.controller.js';

const router = express.Router();

router.post('/signup', signUpBusiness);
router.post('/login', loginBusiness);

export default router;
