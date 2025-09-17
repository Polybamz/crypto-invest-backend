import express from 'express';
import LoanController from '../../controllers/loan_controller/loan_controller.js';
const router = express.Router();
// Routes
/// request loan
router.post('/request', LoanController.requestLoan);
/// update loan status
router.put('/update-status/:loanId/:status', LoanController.updateStatus);
/// get all loans
router.get('/get-all', LoanController.getAllLoans);
/// get loan by loanId
router.get('/get-loan/:loanId', LoanController.getLoansByLoanId);
/// delete loan by loanId
router.delete('/delete-loan/:loanId', LoanController.deleteLoan);
/// get loans by status
router.get('/get-loan-by-status/:status', LoanController.getLoansByStatus);
/// update loan by loanId
router.put('/update-loan/:loanId', LoanController.updateLoan);

export default router;