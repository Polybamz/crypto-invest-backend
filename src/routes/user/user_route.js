import express from 'express';
import { getUserProfile, updateUserProfile, getUserInvestments, getUserTransactions } from '../../controllers/user/user_controller.js';

const router = express.Router();

//router.route('/:userId').get( getUserProfile).patch( updateUserProfile);
router.get('/:userId/investments',  getUserInvestments);
router.get('/:userId/transactions',  getUserTransactions);

export default router;