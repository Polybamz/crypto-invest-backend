// import cron from 'node-cron';
// import { db } from '../config/config';

// // get user and update onLoan status a update wallet balance
// const updateUserOnLoanStatus = async () => {
//     const users = await db.collection('users').where('onLoan', '==', true).get();
//     users.forEach(async (user) => {
//         const wallet = await db.collection('wallets').doc(user.id).get();
//         const balance = wallet.data().balance;
//         if (balance > 0) {
//             await db.collection('users').doc(user.id).update({ onLoan: false });
//         }
//     });
// }

// // run cron job every 10 minutes
// cron.schedule('*/10 * * * *', () => {
//     updateUserOnLoanStatus();
// });