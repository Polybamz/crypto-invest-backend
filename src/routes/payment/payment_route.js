import express from 'express';
import { getPaymentMethods, createPayment, verifyPayment, getPaymentStatus, handleCryptoWebhook } from '../../controllers/payment/payment_controller.js';

const router = express.Router();

router.get('/methods', getPaymentMethods);
router.post('/create',  createPayment);
router.post('/verify',  verifyPayment);
router.get('/status/:paymentId', getPaymentStatus);
router.post('/webhook/crypto', handleCryptoWebhook);

export default router;