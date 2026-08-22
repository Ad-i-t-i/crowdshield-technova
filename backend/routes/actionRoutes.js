import express from 'express';
import { executeAction, getActions } from '../controllers/actionController.js';
const router = express.Router();
router.get('/', getActions);
router.post('/', executeAction);
export default router;
