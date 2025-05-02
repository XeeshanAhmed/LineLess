import express from 'express';
import { generateToken, getLatestToken } from '../controllers/generateToken.controller.js';

const router = express.Router();

router.post('/generate', generateToken); 
router.get('/getLatestToken/:businessId/:departmentId',getLatestToken)

export default router;
