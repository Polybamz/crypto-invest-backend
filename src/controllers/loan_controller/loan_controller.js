import LoanService from "../../services/loans/loan_service.js";
import loanSchema from "../../models/laons/loan_model.js";

class LoanController {
    static async requestLoan(req, res) {
        try {
            const loan = req.body;
            const { error, value } = loanSchema.validate(loan)
            if (error) throw Error(error.message)
            const loanRequest = await LoanService.requestLoan(value);
            return res.status(201).json(loanRequest);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async updateStatus(req, res) {
        try {
            const { loanId, status } = req.params;
            const loan = await LoanService.updateStatus(loanId, status);
            return res.status(200).json(loan);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default LoanController;