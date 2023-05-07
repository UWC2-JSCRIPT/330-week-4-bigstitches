const Token = require('../models/token');
const uuid = require('uuid');

module.exports = {};

// Should be an async function that returns a string after creating a Token Record
module.exports.makeTokenForUserId = async (userId) => {
  const id = uuid.v4();
  const newToken = {
    "index": id,
    "userId": userId,
  }
  try {
    const token = await Token.create(newToken);
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Should be an async function that returns a userId string using the tokenString 
// to get a Token record
module.exports.getUserIdFromToken = async (tokenString) => {
  return Token.findOne({tokenString}).lean();
}

// an async function that deletes the corresponding Token record
module.exports.removeToken = async (tokenString) => {
  return Token.deleteOne({tokenString}).lean();
}
