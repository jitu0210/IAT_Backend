import { submitRating, getGroupRatings } from '../controllers/rating.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.post('/:groupId', authMiddleware, submitRating);
router.get('/:groupId', getGroupRatings);

export default router;