import { createTransaction, getReferralStats, getReferralHistory } from "../../services/referrals/referral_service.js";
import { 
  getAllReferredUsers, 
  getUsersReferredByUser, 
  getCompleteReferralChain, 
  getReferralStatsFromUsers 
} from "../../services/referrals/referral_service.js";
import { db } from "../../config/config.js";

class ReferralsController {
  static async createTransaction(req, res) {
    try {
      const { amount, referral_code, user_id } = req.body;
      const transaction = await createTransaction(amount, referral_code, user_id);
      return res.status(201).json(transaction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getUserReferrals(req, res) {
    try {
      const { uid } = req.params;
      const stats = await getReferralStatsFromUsers(uid);
      const referredUsers = [
        ...stats.tier1Users.map(user => ({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email || '',
          walletBalance: user.walletBalance || 0,
          level: 1,
          joinedAt: user.createdAt
        })),
        ...stats.tier2Users.map(user => ({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email || '',
          walletBalance: user.walletBalance || 0,
          level: 2,
          joinedAt: user.createdAt
        })),
        ...stats.tier3Users.map(user => ({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email || '',
          walletBalance: user.walletBalance || 0,
          level: 3,
          joinedAt: user.createdAt
        }))
      ];

      return res.json({
        tiers: stats.tiers,
        tierEarnings: stats.tierEarnings,
        totalReferrals: stats.totalReferrals,
        activeReferrals: stats.activeReferrals,
        totalEarnings: stats.totalEarnings,
        referredUsers,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch user referrals" });
    }
  }

  static async getAllReferredUsers(req, res) {
    try {
      const referredUsers = await getAllReferredUsers();
      return res.json({
        total: referredUsers.length,
        referredUsers
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch all referred users" });
    }
  }

  static async getUsersByReferralCode(req, res) {
    try {
      const { referral_code } = req.params;
      const referredUsers = await getUsersReferredByUser(referral_code);
      return res.json({
        referralCode: referral_code,
        totalReferrals: referredUsers.length,
        referredUsers
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch users by referral code" });
    }
  }

  static async getCompleteReferralChain(req, res) {
    try {
      const { uid } = req.params;
      const referralChain = await getCompleteReferralChain(uid);
      if (!referralChain) {
        return res.status(404).json({ message: "User not found or has no referral chain" });
      }
      return res.json(referralChain);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch complete referral chain" });
    }
  }

  static async getReferralByEmail(req, res) {
    try {
      const { email } = req.params;
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      if (snapshot.empty) return res.status(404).json({ message: "Referral not found" });

      const userData = snapshot.docs[0].data();
      const userId = snapshot.docs[0].id;
      const stats = await getReferralStatsFromUsers(userId);

      res.json({ 
        user: userData, 
        stats,
        referralChain: await getCompleteReferralChain(userId, 2)
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async getReferralByReferralCode(req, res) {
    try {
      const { referral_code } = req.params;
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("referralCode", "==", referral_code).get();

      if (snapshot.empty) return res.status(404).json({ message: "Referral not found" });

      const userData = snapshot.docs[0].data();
      const userId = snapshot.docs[0].id;
      const stats = await getReferralStatsFromUsers(userId);

      res.json({ 
        user: userData, 
        stats,
        referredUsers: await getUsersReferredByUser(referral_code)
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async updateReferral(req, res) {
    try {
      const { referral_code } = req.params;
      const updates = req.body;

      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("referralCode", "==", referral_code).get();

      if (snapshot.empty) return res.status(404).json({ message: "Referral not found" });

      const userDoc = snapshot.docs[0].ref;
      await userDoc.update({
        ...updates,
        updatedAt: new Date()
      });

      res.json({ message: "Referral updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async getReferralAnalytics(req, res) {
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

      res.json({
        totalReferredUsers: allReferredUsers.length,
        topReferrers,
        referralsByDate: this._groupReferralsByDate(allReferredUsers)
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch referral analytics" });
    }
  }

  static _groupReferralsByDate(referredUsers) {
    const grouped = {};
    referredUsers.forEach(user => {
      if (user.createdAt) {
        const dateKey = user.createdAt.toISOString().split('T')[0];
        if (!grouped[dateKey]) {
          grouped[dateKey] = 0;
        }
        grouped[dateKey]++;
      }
    });
    return grouped;
  }
}

export default ReferralsController;
