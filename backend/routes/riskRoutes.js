import express from 'express';
import { getRiskScore } from '../controllers/riskController.js';
const router = express.Router();
router.get('/', getRiskScore);
export default router;
