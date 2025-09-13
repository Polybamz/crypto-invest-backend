// Create referral chain up to 3 levels
import { admin, db } from '../../config/config.js';
import { AuthServices } from '../registration/auth_service.js';

// Create referral chain up to 3 levels using Firebase Firestore
async function createReferralChainFirebase(referredUserId, referredByCode) {
  let currentCode = referredByCode;
  let currentUserId = referredUserId;
  let level = 1;

  while (currentCode && level <= 3) {
    console.log('currentCodeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', currentCode);

    // 1. Find the referrer user by referral code
    const refrData =  await db
        .collection('users')
        .where('referralCode', '==', `${currentCode}`).limit(1)
        .get();

        // const doc = refrData.docs[0]

    console.log('referrerData', refrData.docs[0].id);

      const referrerData = refrData.docs[0].data();

    if (!referrerData) break; // nothing found

    const referrerUserId = refrData.docs[0].id;
    console.log('referrerUserId', referrerUserId);

    const referralData = {
      referralCode: currentCode,
      referrerUserId: referrerUserId,
      referredUserId: currentUserId,
      level: level,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    console.log('referrGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGgalData', referralData);

    // 2. Save referral document for this level
    await savedReferral(referralData);

    // 3. Move up the chain: find the referrer user's referredBy code
    const userSnap = await db.collection('users').doc(referrerUserId).get();
    if (!userSnap.exists || !userSnap.data().referredBy) break;

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