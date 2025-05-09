import express from 'express';
import { businessLogin, businessSignUp, getLoggedInBusiness, logoutBusiness } from '../controllers/authBusiness.controller.js';

const router = express.Router();

router.post('/signup', businessSignUp);
router.post('/login', businessLogin);
router.get('/me', getLoggedInBusiness);
router.post('/logout', logoutBusiness);

export default router;
