import express from 'express';
import LoanController from '../../controllers/loan_controller/loan_controller.js';
const router = express.Router();

router.post('/request', LoanController.requestLoan);
router.put('/update-status/:loanId/:status', LoanController.updateStatus);

export default router;