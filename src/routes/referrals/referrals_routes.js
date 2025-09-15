import express from 'express';
import ReferralsController from '../../controllers/referrals/referrals_controller.js';

const router = express.Router();

// referral routes
router.get('/user/:uid', ReferralsController.getUserReferrals);

router.post('/create-transaction', ReferralsController.createTransaction);

router.get('/email/:email', ReferralsController.getReferralByEmail);

router.get('/code/:referral_code', ReferralsController.getReferralByReferralCode);

router.patch('/update/:referral_code', ReferralsController.updateReferral);

router.get('/all-referred', ReferralsController.getAllReferredUsers);

router.get('/by-referral-code/:referral_code', ReferralsController.getUsersByReferralCode);

router.get('/chain/:uid', ReferralsController.getCompleteReferralChain);

router.get('/analytics', ReferralsController.getReferralAnalytics);

router.get('/:uid/stats', async (req, res) => {
  const { uid } = req.params;
  try {
    const { getReferralStats, getReferralHistory } = await import('../../services/referrals/referral_service.js');
    const stats = await getReferralStats(uid);
    const referrals = await getReferralHistory(uid);

    res.json({
      tiers: stats.tiers,
      tierEarnings: stats.tierEarnings,
      totalReferrals: stats.totalReferrals,
      activeReferrals: stats.activeReferrals,
      totalEarnings: stats.totalEarnings,
      referredUsers: referrals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;