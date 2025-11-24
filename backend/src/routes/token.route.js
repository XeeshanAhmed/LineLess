import express from 'express';
import { generateToken, getActiveTokensForUser, getLatestToken,getTokenQueue ,updateTokenStatus} from '../controllers/generateToken.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/roleGuard.middleware.js';
const router = express.Router();

router.post('/generate',authenticate,authorizeRoles("user"), generateToken); 
router.get('/getLatestToken/:businessId/:departmentId',authenticate,authorizeRoles("user","business"),getLatestToken)
router.get("/queue/:businessId/:departmentId",authenticate,authorizeRoles("user","business"), getTokenQueue);
router.put("/update-status/:tokenId",authenticate,authorizeRoles("business"), updateTokenStatus);
router.get("/active/:userId",authenticate,authorizeRoles("user"),getActiveTokensForUser)

export default router;
