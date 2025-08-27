const express = require('express');

const app = express();
const port = 5000;

const authRoute = require('./src/routes/auth/auth_route');

app.use(express.json());
app.get('/', (req, res) => {
  console.log('Welcome to Crypto Invest Backend API');
  res.send('Welcome to Crypto Invest Backend API');
});
app.use('/auth', authRoute);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
