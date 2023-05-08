const { Router } = require("express");
const router = Router();
// const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// Middleware isLoggedIn(req, res, next) - should check if the user has a valid token 
// and if so make req.userId = the userId associated with that token. The token will be 
// coming in as a bearer token in the authorization header (i.e. req.headers.authorization = 
// 'Bearer 1234abcd') and you will need to extract just the token text. Any route that says 
// "If the user is logged in" should use this middleware function.
// const isLoggedIn = async (req, res, next) => {
router.use("/", async (req, res, next) => {
  // console.log('In isLoggedIn');
  const regex = /Bearer\s([\w\-]+)/;
  let token = new String;
  const str = req.headers.authorization;
  if (!str) {
    res.status(401).send('Token not provided. Session not authenticated.');
  } else {
    token = str.match(regex)[1] ?? token;
    const tokenReturnedUserId = await tokenDAO.getUserIdFromToken(token);
    if (!tokenReturnedUserId) {
      res.status(401).send('Token does not exist. Session not authenticated.');
    } else {
      req.userId = tokenReturnedUserId;
      next();
    }
  }
});

module.exports = router;