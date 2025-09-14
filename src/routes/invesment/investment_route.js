import express from 'express';
import { getInvestmentPlans, createInvestment, getInvestmentById, getUserInvestments, createPlan } from '../../controllers/investment/investment_controller.js';

const router = express.Router();

router.get('/plans', getInvestmentPlans);
router.post('/plans', createPlan);
router.post('/plansInvestment', createInvestment);
//router.get('in/:investmentId',  getInvestmentById);
//router.get('/user/:userId',  getUserInvestments);

export default router;