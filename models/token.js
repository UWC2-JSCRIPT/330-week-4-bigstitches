const mongoose = require('mongoose');
const User = require('./user');

const tokenSchema = new mongoose.Schema({
  index: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: User, required: true, index: true }
});

module.exports = mongoose.model("tokens", tokenSchema);