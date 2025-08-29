import express from 'express';
import { getInvestmentPlans, createInvestment, getInvestmentById, getUserInvestments } from '../../controllers/investment/investment_controller.js';
import { protect } from '../../middleWare/auth_mw.js/auth_mw.js';

const router = express.Router();

router.get('/plans', getInvestmentPlans);
router.post('/create', protect, createInvestment);
router.get('/:investmentId', protect, getInvestmentById);
router.get('/user/:userId', protect, getUserInvestments);

export default router;