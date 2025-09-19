import { db, admin } from '../../config/config.js';

const generatePlanId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let planId = '';
  for (let i = 0; i < 10; i++) {
    planId += chars.charAt(Math.floor(Math.random() * chars.length));

  }
  return planId;
}

export const createPlan  = async (req, res) => {
  
  try{
    console.log('req.body',req.body)
    const plansRef = db.collection('InvestmentPlans').doc();  
    const plan = await plansRef.set({
        planId: generatePlanId(),
        name: req.body.name,
        amount: req.body.amount,
        roi: req.body.roi,
        days: req.body.days,
        isActive: true,
        tier: req.body.tier,
        features: req.body.features,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
        
      }
    )
    console.log('plan',plan)
    if(plan){
      return res.status(201).json({ message: 'Plan created successfully', plan: plan });
    }
  } catch (er) {
    res.status(500).json({ message: er.message });
  }

}

// @desc    Get all investment plans
// @route   GET /api/investments/plans
export const getInvestmentPlans = async (req, res) => {
  console.log('Fetching investment plans');
  try {
    const plansRef = db.collection('InvestmentPlans');
    const snapshot = await plansRef.where('isActive', '==', true).get();
    const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(plans);
  } catch (error) {
    console.log('Error fetching investment plans:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new investment
// @route   POST /api/investments/create
export const createInvestment = async (req, res) => {
  const { userId, planId, amount } = req.body;

  console.log('Creating investment for user', userId, 'with plan', planId, 'and amount', amount);

  try {
    const planRef = db.collection('InvestmentPlans');
    const planDoc = await planRef.where('planId', '==', planId).get();
    
    if (planDoc.empty) {
      return res.status(404).json({ message: 'Investment plan not found' });
    }
console.log('planDoc', planDoc.docs[0].data());
    const plan = planDoc.docs[0].data();
    const expectedReturn = amount * (1 + plan.roi / 100);

    const newInvestment = {
      userId,
      planId,
      amount,
      startDate: admin.firestore.FieldValue.serverTimestamp(),
      endDate: new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000),
      expectedReturn,
      status: 'pending',
      currentValue: amount,
    };

    const docRef = await db.collection('UserInvestments').add(newInvestment);
    console.log('newInvestment', newInvestment);
    console.log('docRef', docRef);

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





/// get all investments

export const getAllInvestments = async (req, res) => {
  try {
    const investmentsRef = db.collection('UserInvestments');
    const snapshot = await investmentsRef.get();
    const investments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



/// update investment status

export const updateInvestmentStatus = async (req, res) => {
  const { investmentId, status } = req.params;

  console.log('Updating investment', investmentId, 'to status', status);

  try {
    const investmentRef = db.collection('UserInvestments').doc(investmentId);
    const doc = await investmentRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    const investment = doc.data();
    investment.status = status;
    investment.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await investmentRef.update(investment);

    res.status(200).json({ message: 'Investment status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/// get general investment analytics

export const getInvestmentAnalytics = async (req, res) => {
  try {
    const investmentsRef = db.collection('UserInvestments');
    const snapshot = await investmentsRef.get();
   
    const investments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if(investments.isEmpty){
      return res.status(404).json({ 
        totalInvestments: 0,
        totalAmount: 0,
        totalReturn: 0,
        avgReturn: 0,
        totalDuration: 0,
        avgDuration: 0,
        totalDurationInDays: 0,
        avgDurationInDays: 0,
       });
    }
    const totalInvestments = investments.length;
    const totalAmount = investments.reduce((acc, curr) => acc + curr.amount, 0);
    const totalReturn = investments.reduce((acc, curr) => acc + curr.currentValue, 0);
    const avgReturn = totalReturn / totalInvestments;
    const totalDuration = investments.reduce((acc, curr) => acc + (curr.endDate - curr.startDate), 0);
    const avgDuration = totalDuration / totalInvestments;
    const totalDurationInDays = totalDuration / (1000 * 60 * 60 * 24);
    const avgDurationInDays = avgDuration / (1000 * 60 * 60 * 24);
    res.status(200).json({
      totalInvestments,
      totalAmount,
      totalReturn,
      avgReturn,
      totalDuration,
      avgDuration,
      totalDurationInDays,
      avgDurationInDays,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/// user investment analytics

export const getUserInvestmentAnalytics = async (req, res) => {
  const { userId } = req.params;
  try {
    const investmentsRef = db.collection('UserInvestments').where('userId', '==', userId);
    const snapshot = await investmentsRef.get();
    const investments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if(investments.isEmpty){
      return res.status(404).json({ message: 'User has no investments' });
    }
    const totalInvestments = investments.length;
    const totalAmount = investments.reduce((acc, curr) => acc + curr.amount, 0);
    const totalReturn = investments.reduce((acc, curr) => acc + curr.currentValue, 0);
    const avgReturn = totalReturn / totalInvestments;
    const totalDuration = investments.reduce((acc, curr) => acc + (curr.endDate - curr.startDate), 0);
    const avgDuration = totalDuration / totalInvestments;
    const totalDurationInDays = totalDuration / (1000 * 60 * 60 * 24);
    const avgDurationInDays = avgDuration / (1000 * 60 * 60 * 24);
    res.status(200).json({
      totalInvestments,
      totalAmount,
      totalReturn,
      avgReturn,
      totalDuration,
      avgDuration,
      totalDurationInDays,
      avgDurationInDays,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
