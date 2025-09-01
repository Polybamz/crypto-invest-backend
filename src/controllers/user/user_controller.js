import { db } from '../../config/config.js';

// @desc    Get user profile
// @route   GET /api/users/:userId
export const getUserProfile = async (req, res) => {
  console.log('Fetching user profile');
  const { userId } = req.params;

  try {
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PATCH /api/users/:userId
export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  try {
    await db.collection('users').doc(userId).update(updates);
    res.status(200).json({ message: 'User profile updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's investments
// @route   GET /api/users/:userId/investments
export const getUserInvestments = async (req, res) => {
  const { userId } = req.params;
  try {
    const investmentsRef = db.collection('UserInvestments').where('userId', '==', userId);
    const snapshot = await investmentsRef.get();
    const investments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's transactions
// @route   GET /api/users/:userId/transactions
export const getUserTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const transactionsRef = db.collection('Transactions').where('userId', '==', userId).orderBy('timestamp', 'desc');
    const snapshot = await transactionsRef.get();
    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};