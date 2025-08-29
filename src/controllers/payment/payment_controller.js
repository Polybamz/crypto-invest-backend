import { db, admin } from '../../config/config.js';


export const createPaymentMethod = async () => {
    
}

// @desc    Get list of payment methods
// @route   GET /api/payments/methods
export const getPaymentMethods = async (req, res) => {
  try {
    const methodsRef = db.collection('PaymentMethods');
    const snapshot = await methodsRef.where('isActive', '==', true).get();
    const methods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(methods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Initiate a new payment
// @route   POST /api/payments/create
export const createPayment = async (req, res) => {
  const { userId, amount, method } = req.body;
  try {
    const transaction = {
      userId,
      type: 'deposit',
      amount,
      method,
      status: 'pending',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      reference: null,
      investmentId: null,
    };
    const docRef = await db.collection('Transactions').add(transaction);
    res.status(201).json({ message: 'Payment initiated', transactionId: docRef.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit payment verification
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  const { transactionId, proof } = req.body;
  try {
    const verification = {
      transactionId,
      userId: req.user.uid,
      proof,
      status: 'pending',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection('VerificationRequests').add(verification);
    res.status(201).json({ message: 'Verification request submitted', requestId: docRef.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check payment status
// @route   GET /api/payments/status/:paymentId
export const getPaymentStatus = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const transactionRef = db.collection('Transactions').doc(paymentId);
    const doc = await transactionRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ status: doc.data().status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle crypto payment webhook
// @route   POST /api/payments/webhook/crypto
export const handleCryptoWebhook = async (req, res) => {
  // This is a placeholder. You'd need to integrate with a crypto payment gateway
  // like Coinbase Commerce, Crypto.com Pay, etc.
  // The webhook would contain a transaction ID and a status.
  const { transactionId, status, amount } = req.body;

  if (status === 'completed') {
    try {
      const transactionRef = db.collection('Transactions').doc(transactionId);
      await transactionRef.update({ status: 'completed' });

      // Update user balance
      const transactionDoc = await transactionRef.get();
      const userId = transactionDoc.data().userId;
      const userRef = db.collection('Users').doc(userId);
      await userRef.update({
        balance: admin.firestore.FieldValue.increment(amount),
      });

      return res.status(200).send('Webhook received and processed.');
    } catch (error) {
      console.error('Error processing crypto webhook:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  res.status(200).send('Webhook received, no action taken.');
};