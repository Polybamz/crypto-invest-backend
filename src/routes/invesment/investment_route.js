import express from 'express';
import { getInvestmentPlans, createInvestment, getInvestmentById, getUserInvestments, createPlan, getAllInvestments, updateInvestmentStatus, getInvestmentAnalytics, getUserInvestmentAnalytics } from '../../controllers/investment/investment_controller.js';

const router = express.Router();

router.get('/plans', getInvestmentPlans);
router.post('/plans', createPlan);
router.post('/plansInvestment', createInvestment);
router.get('/investment/:investmentId',  getInvestmentById);
router.get('/user/:userId',  getUserInvestments);
router.get('/investments',  getAllInvestments);
router.put('/investment/:investmentId/:status',  updateInvestmentStatus);
router.get('/investment-analysis', getInvestmentAnalytics)
router.get('/user/:userId/investment-analysis', getUserInvestmentAnalytics)


export default router;