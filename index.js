import dotenv from 'dotenv';
dotenv.config();
import express from 'express';


const app = express();

const port = process.env.PORT || 8080;

import authRoute from "./src/routes/auth/auth_route.js"

app.use(express.json());
app.get('/', (req, res) => {
  console.log('Welcome to Crypto Invest Backend API');
  res.send('Welcome to Crypto Invest Backend API');
});
app.use('/auth', authRoute);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
