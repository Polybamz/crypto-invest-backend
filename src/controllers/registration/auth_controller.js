const  {AuthServices}  = require('../../services/registration/auth_service.js');
const {validateUser} = require('../../models/registration/user_model');
const {createReferralChainFirebase, getReferralHistory} = require('../../services/referrals/referral_service.js');
const { db } = require('../../config/config');

class AuthController {
    static generateReferralCode(userId = Date.now()) {
  const code = 'REF' + userId.toString().slice(-6) + Math.random().toString(36).substring(2, 8).toUpperCase();
  return code;
}

    static async register(req, res) {
        const value = req.body;
        console.log( value);
        try {
            const referralCode =  AuthController.generateReferralCode();
            const user = await AuthServices.registerUser(
                value.email, 
                value.password,
                 value.firstName, 
                 value.lastName, 
                 referralCode,
                  value.referredBy,
                );
            if (value.referredBy) {
              const userd =  await AuthServices.getUserById(user.uid);

                console.log('usiegntr;oigjrterd', userd);
                await createReferralChainFirebase(user.uid, userd.referredBy);
            }
            return res.status(201).json({ message: 'User registered successfully', data: user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await AuthServices.loginUser(email, password);
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            return res.status(200).json({ message: 'User logged in successfully', data: user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getUser(req, res) {
        console.log('Fetching user ggggggggggggggggggggggggggggggggggggggggggggggggggg');
        const uid = req.params.uid;
        try {
            const user = await AuthServices.getUserById(uid);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User fetched successfully', data: user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = { AuthController };