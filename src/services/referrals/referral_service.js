// Create referral chain up to 3 levels
import { admin, db } from '../../config/config.js';
import { AuthServices } from '../registration/auth_service.js';

// Create referral chain up to 3 levels using Firebase Firestore

async function createReferralChainFirebase(referredUserId, referredByCode) {
  let currentCode = referredByCode;
  let currentUserId = referredUserId;
  let level = 1;

  while (currentCode && level <= 3) {
    console.log('currentCode', currentCode);

    // 1. Find the referrer user by referral code
    const refSnap = await db
      .collection('users')
      .where('referralCode', '==', currentCode)
      .limit(1)
      .get();

    if (refSnap.empty) {
      console.log('No user found for referral code', currentCode);
      break;
    }

    const refDoc = refSnap.docs[0];
    const referrerData = refDoc.data();
    const referrerUserId = refDoc.id; // Firestore document ID for the user

    console.log('referrerUserId', referrerUserId, 'data', referrerData);

    const referralData = {
      referralCode: currentCode,
      referrerUserId,
      referredUserId: currentUserId,
      level,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // 2. Save referral document for this level
    await savedReferral(referralData);

    // 3. Move up the chain: find the referrer user's referredBy code
    const userSnap = await db.collection('users').doc(referrerUserId).get();
    if (!userSnap.exists || !userSnap.data().referredBy) {
      console.log('No more referrer for user', referrerUserId);
      break;
    }

    currentCode = userSnap.data().referredBy;
    currentUserId = referrerUserId;
    level++;
  }
}




const savedReferral = async (referralData) => {
  console.log('referralData', referralData);
  try {
    const referralRef = db.collection('user_referrals').doc(referralData.referralCode); // Auto-generate ID
    await referralRef.collection('referrals').add(referralData);
    return referralRef;
  } catch (error) {
    console.error(error);
    return null;
  }
}



// Create referral for a user
// Get referral history for a user
async function getReferralHistory(userId) {
  const referralsSnap = await db.collection('referrals').where('referrerUserId', '==', userId).get();
  if (referralsSnap.empty) {
    return null;
  }
  const referrals = [];
  referralsSnap.forEach(refSnap => {
    const referralData = refSnap.data();
    referrals.push({
      referralCode: referralData.referralCode,
      referredUserId: referralData.referredUserId,
      level: referralData.level,
      createdAt: referralData.createdAt.toDate()
    });
  });
  return referrals;
}



export { createReferralChainFirebase, getReferralHistory };