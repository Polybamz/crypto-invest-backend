import express from "express";
import { AuthController } from "../../controllers/registration/auth_controller.js";
import { 
  getAllReferredUsers, 
  getUsersReferredByUser, 
  getCompleteReferralChain, 
  getReferralStatsFromUsers 
} from "../../services/referrals/referral_service.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/user", AuthController.getUser);
router.get('/user-get/:uid', AuthController.getUserById);
router.get('/get-all-users', AuthController.getAllUsers);
router.put('/update-user', AuthController.updateUser);

router.get("/referrals/:uid", async (req, res) => {
  try {
    const stats = await getReferralStatsFromUsers(req.params.uid);
    return res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch referral stats" });
  }
});

router.get("/referrals/all/referred-users", async (req, res) => {
  try {
    const referredUsers = await getAllReferredUsers();
    return res.status(200).json({
      total: referredUsers.length,
      referredUsers
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch all referred users" });
  }
});

router.get("/referrals/by-code/:referral_code", async (req, res) => {
  try {
    const { referral_code } = req.params;
    const referredUsers = await getUsersReferredByUser(referral_code);
    
    return res.status(200).json({
      referralCode: referral_code,
      totalReferrals: referredUsers.length,
      referredUsers
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch users by referral code" });
  }
});

router.get("/referrals/chain/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const referralChain = await getCompleteReferralChain(uid);
    
    if (!referralChain) {
      return res.status(404).json({ message: "User not found or has no referral chain" });
    }

    return res.status(200).json(referralChain);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch complete referral chain" });
  }
});

router.get("/referrals/analytics/overview", async (req, res) => {
  try {
    const allReferredUsers = await getAllReferredUsers();
    
    const referralsByReferrer = {};
    allReferredUsers.forEach(user => {
      const referrerCode = user.referredBy;
      if (referrerCode) {
        if (!referralsByReferrer[referrerCode]) {
          referralsByReferrer[referrerCode] = [];
        }
        referralsByReferrer[referrerCode].push(user);
      }
    });

    const topReferrers = Object.entries(referralsByReferrer)
      .map(([referralCode, users]) => ({
        referralCode,
        totalReferrals: users.length,
        totalEarnings: users.reduce((sum, user) => sum + (user.walletBalance || 0) * 0.1, 0)
      }))
      .sort((a, b) => b.totalReferrals - a.totalReferrals)
      .slice(0, 10);

    const referralsByDate = {};
    allReferredUsers.forEach(user => {
      if (user.createdAt) {
        const dateKey = user.createdAt.toISOString().split('T')[0];
        if (!referralsByDate[dateKey]) {
          referralsByDate[dateKey] = 0;
        }
        referralsByDate[dateKey]++;
      }
    });

    return res.status(200).json({
      totalReferredUsers: allReferredUsers.length,
      topReferrers,
      referralsByDate
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch referral analytics" });
  }
});

export default router;
