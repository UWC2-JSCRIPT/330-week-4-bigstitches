const { Router } = require("express");
const bcrypt = require('bcrypt');
const router = Router();
// const myHeaders = new Headers();

const isLoggedIn = require('../middleware/isLoggedIn')
const hashPassword = require('../middleware/hashPassword')
const requirePassword = require('../middleware/requirePassword')
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// Signup; should use bcrypt on the incoming password. Store user with their email and 
// encrypted password, handle conflicts when the email is already in use.
router.post("/signup", async (req, res, next) => {
  // middleware check for an email address
  if (!req.body.email || JSON.stringify(req.body.email) === '{}' ) {
    res.status(400).send('email is required');
  } else {
    const existingUser = await userDAO.getUser(req.body.email);
    if (!existingUser) {
      next();
    } else {
      res.status(409).send('email already exists');
    }
  }
// put middleware in line
}, requirePassword, async (req, res, next) => {
    let savedHash;
    async function logHash(hash) {
      // console.log(`Hash for ${password} is ${hash}`);
      savedHash = hash;
      const newUser = {
        "email": req.body.email,
        "password": savedHash,
      }
      try {
        const createdUser = await userDAO.createUser(newUser);
        res.sendStatus(200);
        res.json(createdUser);
      } catch(e) {
        // console.log('HERE: ', e);
        if (e instanceof userDAO.BadDataError) {
          res.status(409).send(e.message);
        } else if (e.code === 11000 ) {
          res.status(409).send(`${e.keyValue} is not unique`);
        } 
      }
    }
    bcrypt.hash(req.password, 1).then(logHash);
});

// Login, find the user with the provided email. Use bcrypt to compare stored 
// password with the incoming password. If they match, generate a random token with 
// uuid and return it to the user. 
// require a password and check wither logged in
router.post("/", requirePassword, async (req, res, next) => {
  // middleware check user exists
  req.email = req.body.email;
  req.existingUser = await userDAO.getUser(req.email);
  if (!req.existingUser) {
    res.status(401).send('user not registered');
  } else next()        
}, async (req, res, next) => {
  // middleware check whether the requester is already logged in as a different user
  const regex = /Bearer\s([\w\-]+)/;
  let token = new String;
  const str = req.headers.authorization;
  if (!str) {
    next(); // not already logged in
  } else {
    token = str.match(regex)[1];
    const tokenReturnedUserId = await tokenDAO.getUserIdFromToken(token);
    if (!tokenReturnedUserId) {
      console.log('Testing to see if a token exists before logging in?')
      next(); // a token exists somehow?
    } else {
      if (req.existingUser._id === tokenReturnedUserId) {
        console.log('Testing to see if you try to log in as yourself multiple times?')
        next(); // just loggin in as yourself again? That's allowed
      } else {
        console.log('No you may not log in as someone else')
        res.status(401).send('you may not log in as someone else');
      }
    }
  }
}, async (req, res, _next) => {
  // endpoint bcrypt compare 
  bcrypt.compare(req.body.password, req.existingUser.password, async (err, result) => {
    if (err) {
      console.log("bcrypt compare: ", err);
      res.sendStatus(400).send(err);
    } else if (!result) {
      // console.log('error: ', result, ' ', req.body.password, ' ', req.existingUser.password)
      res.status(401).send('invalid password');
      // need to set 400 but cannot set headers after they are set by client
    } else {
      try {
        const token = await tokenDAO.makeTokenForUserId(req.existingUser._id);
        // req.token = token; // store somewhere in local client
        // res.status(200).setHeader('Authorization', 'Bearer '+token.index).json({"token": token.index}); // WORKS WORKS WORKS
        res.status(200).json({"token": token.index}); // WORKS WORKS WORKS
      } catch (error) {
        console.log('this token login: ', error);
      }
    }  
  });
});


// Logout; If the user is logged in, invalidate their token so they can't use it again (remove it)
router.post("/logout", isLoggedIn, async (req, res, next) => {
  if (!req.userId) {
    res.status(500).send(`user is not logged in`);
  } else next()
  // put middleware in line
}, async (req, res, _next) => {
    try {
      const regex = /Bearer\s([\w\-]+)/;
      let token = new String;
      const str = req.headers.authorization;
      token = str.match(regex)[1] ?? token;
      await tokenDAO.removeToken(token);
      // await tokenDAO.removeToken(req.userId, token);
      // console.log('logged out');
      // await tokenDAO.removeToken(req.userId);
      res.status(200).send(`Logged Out`);
    } catch (error) {
      // console.log('unable to log out');
      res.status(401).send(`Attempting to log out wrong user: ${error}`);
    }
});

// Signup; If the user is logged in, store the incoming password using their userId
router.post("/password", requirePassword, isLoggedIn, hashPassword, async (req, res, next) => {
  try {
    await userDAO.updateUserPassword(req.userId, req.password);
    res.status(200).send('password updated: ');
    // console.log('password changed');
  } catch (error) {
    // console.log(`password not changed. Error Message: ${error}`);
    res.status(500).send(`password not changed. Error Message: ${error}`);
  }
});



module.exports = router;

