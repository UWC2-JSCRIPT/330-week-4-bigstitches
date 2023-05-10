const mongoose = require('mongoose');
const User = require('./user');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: User, required: true, index: true },
  text: { type: String, required: true }
});


module.exports = mongoose.model("notes", noteSchema);