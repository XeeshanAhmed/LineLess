import express from 'express';
import { generateToken, getLatestToken,getTokenQueue ,updateTokenStatus} from '../controllers/generateToken.controller.js';

const router = express.Router();

router.post('/generate', generateToken); 
router.get('/getLatestToken/:businessId/:departmentId',getLatestToken)
router.get("/queue/:businessId/:departmentId", getTokenQueue);
router.put("/update-status/:tokenId", updateTokenStatus);

export default router;
