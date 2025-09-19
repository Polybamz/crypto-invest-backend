import { db, admin } from "../../config/config.js";

class LoanService {
    static async requestLoan(loan) {
        try {
             await db.collection("loans").doc(loan.loan_id).set({
                ...loan,
                status: "pending",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }
            );
            return loan.loan_id;
        } catch (error) {
            console.log(error);
            throw Error(error.message);
        }
    }

    static updateStatus(loanId, status) {
        try {
            return db.collection("loans").doc(loanId).update({
                status,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.log(error);
            throw Error(error.message);
        }
    }
    static async getLoansByLoanId(loanId) {
        try {
            const loan = await db.collection("loans").doc(loanId).get();
            if (!loan.exists) {
                throw Error("Loan not found");
            } else {
                return loan.data();
            }

        } catch (error) {
            throw Error(error.message);
        }
    }
    static async getAllLoans() {
        try {
            const loans = await db.collection("loans").get();
            return loans.docs.map((loan) => {
                return loan.data();
            });
        } catch (error) {
            console.log(error);
            throw Error(error.message);
        }
    }
    static async deleteLoan(loanId) {
        try {
            return db.collection("loans").doc(loanId).delete();
        } catch (error) {
            console.log(error);
            throw Error(error.message);
        }
    }
    static async getLoansByStatus(status) {
        try {
            const loans = await db.collection("loans").where("status", "==", status).get();
            return loans.docs.map((loan) => {
                return loan.data();
            });
        } catch (error) {
            console.log(error);
            throw Error(error.message);
        }
    }
    static async updateLoan(loanId, loan) {
        try {
            return db.collection("loans").doc(loanId).update({
                ...loan,
                 updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.log(error);
            throw Error(error.message);
        }
    }
/// general loan analytics
static async getGeneralLoanAnalytics() {
    try {
        const loans = await db.collection("loans").get();
        if (loans.empty) {
            return {
                totalLoans: 0,
                approvedLoans: 0,
                pendingLoans: 0,
                rejectedLoans: 0,
                totalAmount: 0,
                approvedAmount: 0,
                pendingAmount: 0,
                rejectedAmount: 0
            };
        }
        const totalLoans = loans.docs.length;
        const approvedLoans = loans.docs.filter((loan) => loan.data().status === "approved").length;
        const pendingLoans = loans.docs.filter((loan) => loan.data().status === "pending").length;
        const rejectedLoans = loans.docs.filter((loan) => loan.data().status === "rejected").length;
        const totalAmount = loans.docs.reduce((acc, loan) => acc + loan.data().amount, 0);
        const approvedAmount = loans.docs.filter((loan) => loan.data().status === "approved").reduce((acc, loan) => acc + loan.data().amount, 0);
        const pendingAmount = loans.docs.filter((loan) => loan.data().status === "pending").reduce((acc, loan) => acc + loan.data().amount, 0);
        const rejectedAmount = loans.docs.filter((loan) => loan.data().status === "rejected").reduce((acc, loan) => acc + loan.data().amount, 0);
        return {
            totalLoans,
            approvedLoans,
            pendingLoans,
            rejectedLoans,
            totalAmount,
            approvedAmount,
            pendingAmount,
            rejectedAmount
        };
    } catch (error) {
        console.log(error);
        throw Error(error.message);
    }
}

}

export default LoanService;