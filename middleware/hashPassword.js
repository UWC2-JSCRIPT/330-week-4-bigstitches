const { Router } = require("express");
const bcrypt = require('bcrypt');
const router = Router();

// Middleware takes clear-text password and updates req.password with a hashified password
router.use("/", async (req, res, next) => {
  const password = req.body.password;

  async function logHash(hash) {
    // console.log(`Hash for ${password} is ${hash}`);
    req.password = hash;
    next();
  }

  bcrypt.hash(password, 1).then(logHash);
  
});

module.exports = router;