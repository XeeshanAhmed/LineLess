import express from 'express';
import {
  getTokenAnalytics,
  getFeedbackAnalytics,
} from '../controllers/analytics.controller.js';

const router = express.Router();

// Route for getting token analytics
router.get('/tokens/:businessId/:departmentId', getTokenAnalytics);

// Route for getting feedback analytics
router.get('/feedback/:businessId/:departmentId', getFeedbackAnalytics);

export default router;
