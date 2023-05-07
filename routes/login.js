const { Router } = require("express");
const bcrypt = require('bcrypt');
const router = Router();

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');

// needs to handle users that want to login but dont have accounts
// needs to handle someone trying to log out when they're not logged in

// Signup; should use bcrypt on the incoming password. Store user with their email and 
// encrypted password, handle conflicts when the email is already in use.
router.post("/signup", async (req, res, next) => {
  // middleware check for an email address
  if (!req.body.email || JSON.stringify(req.body.email) === '{}' ) {
    res.status(400).send('email is required');
  } else {
    const existingUser = await userDAO.getUser(req.body.email);
    if (!existingUser) {
      // console.log(`sign up new user ${req.body.email}`);
      next();
    } else {
      // console.log(`${req.body.email} already exists`);
      res.status(409).send('email already exists');
    }
  }
}, (req, res, next) => {
  // middleware hash password
  // console.log('moved into middleware user email does not already exist');
  let { password } = req.body;
  if (!password || JSON.stringify(password) === '{}' ) {
    res.status(400).send('password is required');
  } else {
    let savedHash;
    function logHash(hash) {
      // console.log(`Hash for ${password} is ${hash}`);
      savedHash = hash;
      const newUser = {
        "email": req.body.email,
        "password": savedHash,
      }
      try {
        const createdUser = userDAO.createUser(newUser);
        res.sendStatus(200);
        res.json(createdUser);
      } catch(e) {
        // console.log('HERE: ', e);
        if (e instanceof userDAO.BadDataError) {
          res.status(409).send(e.message);
        } else if (e.code === 11000 ) {
          res.status(409).send(`${e.keyValue} is not unique`);
        } else {
          // res.status(500).send(e.message);
        }
      }
    }
    bcrypt.hash(password, 1).then(logHash);
    // next(); // comment out! otherwise this will go into the '/' POST and try to login right away
  }
});



// Login, find the user with the provided email. Use bcrypt to compare stored 
// password with the incoming password. If they match, generate a random token with 
// uuid and return it to the user. 
router.post("/", (req, res, next) => {
  // middleware check password
  req.password = req.body.password;
  if (!req.password || JSON.stringify(req.password) === '{}' ) {
    res.status(400).send('password is required');
  } else next()
}, async (req, res, next) => {
  // middleware check user exists
  req.email = req.body.email;
  req.existingUser = await userDAO.getUser(req.email);
  if (!req.existingUser) {
    res.status(401).send('user not registered');
  } else next()
}, async (req, res, _next) => {
  // endpoint bcrypt compare 
  const existingUser = req.existingUser;
  bcrypt.compare(req.password, existingUser.password, async (err, result) => {
    if (err) {
      res.sendStatus(400).send(err);
    } else if (!result) {
      res.send('invalid password');
      // need to set 400 but cannot set headers after they are set by client
    } else {
      try {
        const token = await tokenDAO.makeTokenForUserId(existingUser._id);
        req.token = token; // store somewhere in local client
        res.json(token);
      } catch (error) {
        console.log('this token login: ', error);
      }
    }  
  });
});

// Middleware
// - isLoggedIn(req, res, next) - should check if the user has a valid token and if so make 
// req.userId = the userId associated with that token. The token will be coming in as a bearer token 
// in the authorization header (i.e. req.headers.authorization = 'Bearer 1234abcd') and you will need 
// to extract just the token text. Any route that says "If the user is logged in" should use this 
// middleware function.

// Signup; If the user is logged in, store the incoming password using their userId
router.post("/password", async (req, res, next) => {
  console.log('PASSWORD', req.body);
  console.log('PASSWORD', req.body);
  req.userId = req.body.userId;
  req.password = req.body.password;
  req.index = req.body.index;

  // middleware xxx
  // save new password
});

// Logout; If the user is logged in, invalidate their token so they can't 
// use it again (remove it)
router.post("/logout", async (req, res, next) => {
  console.log('LOGOUT', req.body);
  // middleware getuser
  // signout
});

module.exports = router;

/*

// Read - single user
router.get("/:id", async (req, res, next) => {
  const user = await userDAO.getById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
});

// Read - all users
router.get("/", async (req, res, next) => {
  /*
  const password = '123password';
  let savedHash;
  function logHash(hash) {
    console.log(`Hash for ${password} is ${hash}`);
    savedHash = hash;
  }
  bcrypt.hash(password, 5).then(logHash);
  */
/*
  let { page, perPage, query } = req.query;
  page = page ? Number(page) : 0;
  perPage = perPage ? Number(perPage) : 10;
  const users = await userDAO.getAll(page, perPage);
  res.json(users);
});

// Update
router.put("/:id", async (req, res, next) => {
  const userId = req.params.id;
  const user = req.body;
  if (!user || JSON.stringify(user) === '{}' ) {
    res.status(400).send('user is required"');
  } else {
    const updateduser = await userDAO.updateById(userId, user);
    res.json(updateduser);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  const userId = req.params.id;
  try {
    await userDAO.deleteById(userId);
    res.sendStatus(200);
  } catch(e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
*/