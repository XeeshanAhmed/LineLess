import express from 'express';
import { getDepartmentsByBusinessId } from '../controllers/department.controller.js';

const router = express.Router();

router.get('/getDeptByBusinessId/:businessId', getDepartmentsByBusinessId);

export default router;
