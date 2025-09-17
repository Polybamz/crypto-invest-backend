import { db, admin } from "../../config/config.js";

class LoanService {
static async requestLoan(loan) {
    try {
        const loanRef = await db.collection("loans").add({
            ...loan, 
            status: "pending" , 
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()}
        );
        return loanRef.id;
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

}

export default LoanService;