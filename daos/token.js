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
  // console.log('In find a user id for hte token'); // good to go, hitting this from my middleware isLoggedIn
  const token = await Token.findOne({index : tokenString}).lean();
  if (!token) {
    return null;
  } else {
    return token.userId; // return example: new ObjectId("64593a635a1ba72d31e69ebd")
  }
}

// an async function that deletes the corresponding Token record
module.exports.removeToken = async (token) => {
  // console.log("HEREREHREHRHERHER ", token);
  return (await Token.deleteOne({index : token}).lean());
  // return (await Token.deleteMany({index : tokenString}).lean());
}

// Let's try something else to pass the tests....
// allow the user to stay logged in on other devices; only log the user out on 
// the current device/session/token
/*
module.exports.removeToken = async (userId, token) => {
  // return (await Token.deleteOne({index : token}).lean());
  return (await Token.deleteOne({$and:[{_id : userId}, {index : token}]}).lean());
}
*/
/*
module.exports.removeToken = async (userId) => {
  // return (await Token.deleteOne({index : token}).lean());
  return (await Token.deleteOne({_id : userId}).lean());
}
*/