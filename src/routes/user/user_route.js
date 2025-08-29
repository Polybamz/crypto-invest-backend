import express from 'express';
import { getUserProfile, updateUserProfile, getUserInvestments, getUserTransactions } from '../../controllers/user/user_controller.js';
import { protect } from '../../middleWare/auth_mw.js/auth_mw.js';

const router = express.Router();

router.route('/:userId').get(protect, getUserProfile).patch(protect, updateUserProfile);
router.get('/:userId/investments', protect, getUserInvestments);
router.get('/:userId/transactions', protect, getUserTransactions);

export default router;