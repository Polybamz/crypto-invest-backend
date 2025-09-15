import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

import authRoute from "./src/routes/auth/auth_route.js";
import userRoute from "./src/routes/user/user_route.js";
import paymentRoute from "./src/routes/payment/payment_route.js";
import investmentRoute from "./src/routes/invesment/investment_route.js";
import referralRoutes from './src/routes/referrals/referrals_routes.js';

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS (allow your React frontend to access backend)
app.use(cors({
  origin: '*' // For testing. Replace '*' remove it when u upload to production
}));

// Parse JSON bodies
app.use(express.json());

// Test route to check backend connection
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Backend is working!', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  console.log('Welcome to Crypto Invest Backend API');
  res.send('Welcome to Crypto Invest Backend API');
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/referrals', referralRoutes);
app.use('/api/v1', userRoute);
app.use('/api/v1', paymentRoute);
app.use('/api/v1', investmentRoute);

// Start server
app.listen(port, () => {
  console.log(`Crypto Invest backend listening on port ${port}`);
});
