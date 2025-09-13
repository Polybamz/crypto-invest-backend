const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true, unique: true },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rewards: [{ type: Number }], // Store reward amounts per referral
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Referral', referralSchema);
