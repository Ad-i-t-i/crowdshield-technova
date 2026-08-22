import express from 'express';
import { getSensors } from '../controllers/sensorController.js';
const router = express.Router();
router.get('/', getSensors);
export default router;
