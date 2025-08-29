import { db, admin } from '../../config/config.js';

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
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const userData = this.getUserById(user.uid);
            return userData;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async loginUser(email, password) {
        try {
            const user = await admin.auth().signInWithEmailAndPassword(email, password);
            const userData = this.getUserById(user.uid);
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

export default AuthServices;