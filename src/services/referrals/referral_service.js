import { db } from '../../config/config.js';

// ======================
// Helper Functions
// ======================

// Get all users who have been referred (have a referredBy field)
async function getAllReferredUsers() {
  try {
    const referredUsersSnap = await db
      .collection('users')
      .where('referredBy', '!=', null)
      .where('referredBy', '!=', '')
      .get();

    if (referredUsersSnap.empty) return [];

    const referredUsers = [];
    for (const doc of referredUsersSnap.docs) {
      const userData = doc.data();
      referredUsers.push({
        id: doc.id,
        ...userData,
        createdAt: userData.createdAt?.toDate(),
        updatedAt: userData.updatedAt?.toDate()
      });
    }

    return referredUsers;
  } catch (error) {
    console.error('Error fetching referred users:', error);
    return [];
  }
}

// Get users referred by a specific user (using their referral code)
async function getUsersReferredByUser(referralCode) {
  try {
    const referredUsersSnap = await db
      .collection('users')
      .where('referredBy', '==', referralCode)
      .get();

    if (referredUsersSnap.empty) return [];

    const referredUsers = [];
    for (const doc of referredUsersSnap.docs) {
      const userData = doc.data();
      referredUsers.push({
        id: doc.id,
        ...userData,
        createdAt: userData.createdAt?.toDate(),
        updatedAt: userData.updatedAt?.toDate()
      });
    }

    return referredUsers;
  } catch (error) {
    console.error('Error fetching users referred by specific user:', error);
    return [];
  }
}

// Get complete referral chain for a user (all levels)
async function getCompleteReferralChain(userId, maxLevel = 3) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return [];

    const userData = userDoc.data();
    const referralCode = userData.referralCode;
    if (!referralCode) return [];

    // Find all users who have this user's referral code
    const directReferrals = await getUsersReferredByUser(referralCode);

    const referralChain = {
      user: {
        id: userId,
        ...userData,
        referralCode
      },
      directReferrals,
      totalReferrals: directReferrals.length
    };

    if (maxLevel > 1) {
      for (const referral of directReferrals) {
        referral.referrals = await getCompleteReferralChain(referral.id, maxLevel - 1);
      }
    }

    return referralChain;
  } catch (error) {
    console.error('Error getting complete referral chain:', error);
    return null;
  }
}

// ======================
// Core Service Functions
// ======================

// Create a referral transaction (stub — adjust logic to your app)
async function createTransaction({ userId, amount, referralCode }) {
  try {
    const transactionRef = await db.collection('referralTransactions').add({
      userId,
      amount,
      referralCode,
      createdAt: new Date()
    });

    return { id: transactionRef.id, userId, amount, referralCode };
  } catch (error) {
    console.error('Error creating referral transaction:', error);
    throw error;
  }
}

// Get referral statistics (wrapper for getReferralStatsFromUsers)
async function getReferralStats(userId) {
  return await getReferralStatsFromUsers(userId);
}

// Get referral history for a user
async function getReferralHistory(userId) {
  try {
    const historySnap = await db
      .collection('referralTransactions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    if (historySnap.empty) return [];

    return historySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching referral history:', error);
    return [];
  }
}

// ======================
// Internal Stats Calculator
// ======================

async function getReferralStatsFromUsers(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return {
        tiers: { 1: 0, 2: 0, 3: 0 },
        tierEarnings: { 1: 0, 2: 0, 3: 0 },
        totalReferrals: 0,
        totalEarnings: 0,
        activeReferrals: 0
      };
    }

    const userData = userDoc.data();
    const referralCode = userData.referralCode;
    if (!referralCode) {
      return {
        tiers: { 1: 0, 2: 0, 3: 0 },
        tierEarnings: { 1: 0, 2: 0, 3: 0 },
        totalReferrals: 0,
        totalEarnings: 0,
        activeReferrals: 0
      };
    }

    // Tier 1
    const tier1Users = await getUsersReferredByUser(referralCode);

    // Tier 2
    let tier2Users = [];
    for (const tier1User of tier1Users) {
      if (tier1User.referralCode) {
        const tier2 = await getUsersReferredByUser(tier1User.referralCode);
        tier2Users = tier2Users.concat(tier2);
      }
    }

    // Tier 3
    let tier3Users = [];
    for (const tier2User of tier2Users) {
      if (tier2User.referralCode) {
        const tier3 = await getUsersReferredByUser(tier2User.referralCode);
        tier3Users = tier3Users.concat(tier3);
      }
    }

    const commissionRates = { 1: 10, 2: 7, 3: 5 };

    const tiers = {
      1: tier1Users.length,
      2: tier2Users.length,
      3: tier3Users.length
    };

    const tierEarnings = {
      1: tier1Users.reduce((sum, user) => sum + (user.walletBalance || 0) * (commissionRates[1] / 100), 0),
      2: tier2Users.reduce((sum, user) => sum + (user.walletBalance || 0) * (commissionRates[2] / 100), 0),
      3: tier3Users.reduce((sum, user) => sum + (user.walletBalance || 0) * (commissionRates[3] / 100), 0)
    };

    const totalEarnings = Object.values(tierEarnings).reduce((a, b) => a + b, 0);
    const totalReferrals = tier1Users.length + tier2Users.length + tier3Users.length;

    return {
      tiers,
      tierEarnings,
      totalReferrals,
      totalEarnings,
      activeReferrals: tier1Users.length,
      tier1Users,
      tier2Users,
      tier3Users
    };
  } catch (error) {
    console.error('Error computing referral stats from users:', error);
    return {
      tiers: { 1: 0, 2: 0, 3: 0 },
      tierEarnings: { 1: 0, 2: 0, 3: 0 },
      totalReferrals: 0,
      totalEarnings: 0,
      activeReferrals: 0
    };
  }
}

// ======================
// Exports
// ======================
export {
  getAllReferredUsers,
  getUsersReferredByUser,
  getCompleteReferralChain,
  getReferralStatsFromUsers,
  // Controller-facing exports
  createTransaction,
  getReferralStats,
  getReferralHistory
};
