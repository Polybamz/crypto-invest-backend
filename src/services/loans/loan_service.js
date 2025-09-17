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


}

export default LoanService;