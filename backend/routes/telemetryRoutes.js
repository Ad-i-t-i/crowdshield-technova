import express from 'express';
import { getTelemetry } from '../controllers/telemetryController.js';

const router = express.Router();

router.get('/', getTelemetry);

export default router;
