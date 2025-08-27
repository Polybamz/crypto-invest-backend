const { AuthServices } = require('../../services/registration/auth_service');
const {validateUser} = require('../../models/registration/user_model');

class AuthController {
    static generateReferralCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    static async register(req, res) {
        const data = req.body;
        console.log(data);
        const { error, value } = validateUser(data);
        console.log(error, value);
        if (error) {
            throw new Error(error.details[0].message);
        }

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
            if (!user) {
                return res.status(400).json({ message: 'User registration failed' });
            }
            return res.status(201).json({ message: 'User registered successfully', data: user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
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