const Transaction = require('../models/note');

module.exports = {};

module.exports.getAll = (userId, page, perPage) => {
  return Transaction.find({ userId }).limit(perPage).skip(perPage*page).lean();
}

module.exports.getById = (userId, transactionId) => {
  return Transaction.findOne({ _id: transactionId, userId }).lean();
}

module.exports.deleteById = (userId, transactionId) => {
  return Transaction.deleteOne({ _id: transactionId, userId });
}

module.exports.updateById = (userId, transactionId, newObj) => {
  return Transaction.update({ _id: transactionId, userId }, newObj);
}

module.exports.create = (transactionData) => {
  return Transaction.create(transactionData);
}