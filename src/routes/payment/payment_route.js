import express from 'express';
import { getPaymentMethods, createPayment, verifyPayment, getPaymentStatus, handleCryptoWebhook } from '../../controllers/payment/payment_controller.js';
import { protect } from '../../middleWare/auth_mw.js/auth_mw.js';

const router = express.Router();

router.get('/methods', getPaymentMethods);
router.post('/create', protect, createPayment);
router.post('/verify', protect, verifyPayment);
router.get('/status/:paymentId', protect, getPaymentStatus);
router.post('/webhook/crypto', handleCryptoWebhook);

export default router;