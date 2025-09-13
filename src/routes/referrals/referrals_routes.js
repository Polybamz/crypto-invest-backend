import express from 'express';
import ReferralsController from '../../controllers/referrals/referrals_controller';
const router = express.Router();

router.post('/create-transaction', ReferralsController.createTransaction);
router.get('/email/:email', ReferralsController.getReferralByEmail);
router.get('/code/:referral_code', ReferralsController.getReferralByReferralCode);
router.get('/user/:user_id', ReferralsController.getReferralByUserId);
router.patch('/update/:referral_code', ReferralsController.updateReferral);

export default router;