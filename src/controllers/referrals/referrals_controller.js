import { createTransaction, getUserReferrals, getUserCommissions } from "../../services/referrals/referral_service";

class ReferralsController {
  static async createTransaction(req, res) {
    try {
      const { amount, referral_code, user_id } = req.body;
      const transaction = await createTransaction(amount, referral_code, user_id);
      return res.status(201).json(transaction);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

static async getUserReferrals(req, res){
    try {
        
    } catch (er){}
}

}

export default ReferralsController;