import LoanService from "../../services/loans/loan_service.js";
import loanSchema from "../../models/laons/loan_model.js";

class LoanController {
    static async requestLoan(req, res) {
        try {
            const loan = req.body;
            const { error, value } = loanSchema.validate(loan)
            if (error) throw Error(error.message)
            const loanRequest = await LoanService.requestLoan(value);
            return res.status(200).json({success:true,id:loanRequest});
        } catch (error) {
            return res.status(500).json({success:false, message: error.message });
        }
    }
    static async updateStatus(req, res) {
        try {
            const { loanId, status } = req.params;
            const loan = await LoanService.updateStatus(loanId, status);
            return res.status(200).json({success:true,data:loan});
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getLoansByLoanId(req, res) {
        try {
            const { loanId } = req.params;
            const loan = await LoanService.getLoansByLoanId(loanId);
            return res.status(200).json({success:true,data:loan});
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        }

    static async getAllLoans(req, res) {
        try {
            const loans = await LoanService.getAllLoans();
            return res.status(200).json({success:true,data:loans});
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    static async deleteLoan(req, res) {
        try {
            const { loanId } = req.params;
            const loan = await LoanService.deleteLoan(loanId);
            return res.status(200).json({success:true,data:loan});
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getLoansByStatus(req, res) {
        try {
            const { status } = req.params;
            const loans = await LoanService.getLoansByStatus(status);
            return res.status(200).json({success:true,data:loans});
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    static async updateLoan(req, res) {
        try {
            const { loanId } = req.params;
            const loan = req.body;
            const { error, value } = loanSchema.validate(loan)
            if (error) throw Error(error.message)
            const updatedLoan = await LoanService.updateLoan(loanId, value);
            return res.status(200).json({success:true,data:updatedLoan});
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }


}

export default LoanController;