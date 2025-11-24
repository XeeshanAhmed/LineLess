import express from 'express';
import { createDepartment, deleteDepartment, getDepartmentsByBusinessId, updateDepartment } from '../controllers/department.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/roleGuard.middleware.js';

const router = express.Router();

router.get('/getDeptByBusinessId/:businessId',authenticate,authorizeRoles("user","business"), getDepartmentsByBusinessId);
router.put("/:departmentId",authenticate,authorizeRoles("business"), updateDepartment);
router.delete("/:departmentId",authenticate,authorizeRoles("business"), deleteDepartment);
router.post("/create",authenticate,authorizeRoles("business"), createDepartment);

export default router;
