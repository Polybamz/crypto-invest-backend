import express from 'express';
import { getInvestmentPlans, createInvestment, getUserInvestments, createPlan, getAllInvestments, updateInvestmentStatus, getInvestmentAnalytics, getUserInvestmentAnalytics } from '../../controllers/investment/investment_controller.js';

const router = express.Router();

router.get('/plans', getInvestmentPlans);
//router.post('/create-plans', createPlan);
router.post('/make-investment', createInvestment);
router.get('/user-investments/:userId',  getUserInvestments);
router.get('/all-investments',  getAllInvestments);
router.put('/investment/:investmentId/:status',  updateInvestmentStatus);
router.get('/investment-analysis', getInvestmentAnalytics)
router.get('/user/:userId/investment-analysis', getUserInvestmentAnalytics)


export default router;