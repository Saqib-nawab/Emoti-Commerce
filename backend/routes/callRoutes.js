import express from 'express';
const router = express.Router();
import {
    getCallHistories,
    getCallHistoryById,
    createCallHistory,
    updateCallHistory,
    deleteCallHistory,
} from '../controllers/callController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(protect, admin, getCallHistories).post(protect, createCallHistory);
router
    .route('/:id')
    .get(protect, admin, checkObjectId, getCallHistoryById)
    .put(protect, admin, checkObjectId, updateCallHistory)
    .delete(protect, admin, checkObjectId, deleteCallHistory);

export default router;
