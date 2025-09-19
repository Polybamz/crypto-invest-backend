import { AuthServices } from "../../services/registration/auth_service.js";
import { validateUser } from "../../models/registration/user_model.js";
import { db } from "../../config/config.js";
import { doc, updateDoc, increment, getDocs, collection, query, where } from "firebase/firestore";

export class AuthController {
  static generateReferralCode(userId = Date.now()) {
    return (
      "REF" +
      userId.toString().slice(-6) +
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
  }

  static async register(req, res) {
    const { value, error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      const referralCode = AuthController.generateReferralCode();

      const user = await AuthServices.registerUser(
        value.email,
        value.password,
        value.firstName,
        value.lastName,
        referralCode,
        value.referredBy || null
      );

      if (value.referredBy) {
        const q = query(
          collection(db, "users"),
          where("referralCode", "==", value.referredBy)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const referrerDoc = querySnapshot.docs[0];
          const referrerId = referrerDoc.id;

          await updateDoc(doc(db, "users", referrerId), {
            bonus: increment(100),
            updatedAt: new Date()
          });

          await updateDoc(doc(db, "users", user.uid), {
            bonus: increment(50),
            updatedAt: new Date()
          });

          await updateDoc(doc(db, "users", referrerId), {
            referralCount: increment(1),
            updatedAt: new Date()
          });
        }
      }

      return res.status(200).json({
        message: "User registered successfully",
        data: user,
        referralCode,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await AuthServices.loginUser(email, password);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      return res
        .status(200)
        .json({ message: "User logged in successfully", data: user });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  static async getUser(req, res) {
    console.log("Fetching user...");
    const uid = req.params.uid;
    try {
      const user = await AuthServices.getUserById(uid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "User fetched successfully", data: user });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  static async getUserByReferralCode(req, res) {
    const { referralCode } = req.params;
    try {
      const q = query(
        collection(db, "users"),
        where("referralCode", "==", referralCode)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return res.status(404).json({ message: "User not found with this referral code" });
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      return res.status(200).json({
        message: "User found",
        data: {
          id: userDoc.id,
          ...userData
        }
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  static async validateReferralCode(req, res) {
    const { referralCode } = req.params;
    try {
      const q = query(
        collection(db, "users"),
        where("referralCode", "==", referralCode)
      );
      const querySnapshot = await getDocs(q);

      return res.status(200).json({
        isValid: !querySnapshot.empty,
        message: querySnapshot.empty ? "Invalid referral code" : "Referral code is valid"
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  static async getUserById(req, res) {
    const { uid } = req.params;
    try {
      const user = await AuthServices.getUserById(uid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "User fetched successfully", data: user });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
}
