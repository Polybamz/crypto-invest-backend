import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors'




const app = express();

const port = process.env.PORT || 8080;

import authRoute from "./src/routes/auth/auth_route.js"
import userRoute from "./src/routes/user/user_route.js"
import paymentRoute from "./src/routes/payment/payment_route.js"
import investmentRoute from "./src/routes/invesment/investment_route.js"
import feedbackRoute from "./src/routes/feedback/feedback_route.js"
import contactRoute from "./src/routes/contact/contact_route.js"  
app.use(cors(
  {
    origin: '*'
  }
));
app.use(express.json());
app.get('/', (req, res) => {
  console.log('Welcome to Crypto Invest Backend API');
  res.send('Welcome to Crypto Invest Backend API');
});
app.use('/api/auth', authRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', paymentRoute);
app.use('/api/v1', investmentRoute);
app.use('/api/v1', feedbackRoute);
app.use('/api/v1', contactRoute);

app.listen(port, () => {
  console.log(`Crypto I listening on port ${port}`);
});
