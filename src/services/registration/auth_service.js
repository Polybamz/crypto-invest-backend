import { db, admin } from '../../config/config.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

class AuthServices {
    static async registerUser(email, password, firstName, lastName, referralCode, referredBy) {
        try {
            console.log(email, password, firstName, lastName, referralCode, referredBy);
            const user = await admin.auth().createUser({
                email: email,
                password: password,
                displayName: `${firstName} ${lastName}`,
            });
            /// Add user to firestore
            await db.collection('users').doc(user.uid).set({
                email: email,
                firstName: firstName,
                lastName: lastName,
                referralCode: referralCode,
                referredBy: referredBy,
                walletBalance: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const userData = this.getUserById(user.uid);
            return userData;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    static getUserById(uid) {
        console.log('uid', uid);
        try {
            const userDoc = db.collection('users').doc(uid).get();
            if (!userDoc.exists) {
                console.log('No such user!');
                return null;
            }
            console.log('userDoc.data()', userDoc.data());
            return { uid: uid, ...userDoc.data() };
        } catch (error) {
            console.log(error);
            return null;
        }

    }

    static getwalletBalance(uid) {
        try {
            const userDoc = db.collection('users').doc(uid).get();
            if (!userDoc.exists) {
                console.log('No such user!');
                return null;
            }
            console.log('userDoc.data()', userDoc.data());
            return { uid: uid, balance: userDoc.data().walletBalance };
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async getUserByReferralCode(referralCode) {

        console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn', referralCode);
        try {
            const userSnap = await db
                .collection('users')
                .where('referralCode', '==', `${referralCode}`)

                .get();
            console.log('userSnappppppppppppppppppppppppppppppppppppppp', userSnap);


            if (userSnap.empty) return null;
            console.log('userSnap.docs[0].data()', userSnap.docs[0].data());
            // return plain object with userId included
            return { ...userSnap.docs[0].data(), id: userSnap.docs[0].id };
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async loginUser(email, password) {
        try {
            const user = await admin.auth().getUserByEmail(email);
            const userData = this.getUserById(user.uid);
            console.log(userData, password);
            return userData;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    // Fetch user from firestore by UID
    static async getUserById(uid) {
        try {
            const userDoc = await db.collection('users').doc(uid).get();
            if (!userDoc.exists) {
                return null;
            }
            return { uid: uid, ...userDoc.data() };
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
export { AuthServices };