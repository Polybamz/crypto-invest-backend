import { db, admin } from '../../config/config.js';


export const createPlan  = async () => {

}

// @desc    Get all investment plans
// @route   GET /api/investments/plans
export const getInvestmentPlans = async (req, res) => {
  try {
    const plansRef = db.collection('InvestmentPlans');
    const snapshot = await plansRef.where('isActive', '==', true).get();
    const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new investment
// @route   POST /api/investments/create
export const createInvestment = async (req, res) => {
  const { userId, planId, amount } = req.body;

  try {
    const planRef = db.collection('InvestmentPlans').doc(planId);
    const planDoc = await planRef.get();
    if (!planDoc.exists) {
      return res.status(404).json({ message: 'Investment plan not found' });
    }

    const plan = planDoc.data();
    const expectedReturn = amount * (1 + plan.roi / 100);

    const newInvestment = {
      userId,
      planId,
      amount,
      startDate: admin.firestore.FieldValue.serverTimestamp(),
      endDate: new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000),
      expectedReturn,
      status: 'active',
      currentValue: amount,
    };

    const docRef = await db.collection('UserInvestments').add(newInvestment);

    res.status(201).json({ message: 'Investment created successfully', investmentId: docRef.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get investment details
// @route   GET /api/investments/:investmentId
export const getInvestmentById = async (req, res) => {
  const { investmentId } = req.params;
  try {
    const investmentRef = db.collection('UserInvestments').doc(investmentId);
    const doc = await investmentRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Investment not found' });
    }
    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all investments for a user
// @route   GET /api/investments/user/:userId
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