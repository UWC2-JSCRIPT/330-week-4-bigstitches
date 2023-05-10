const { Router } = require("express");
const router = Router();

// Middleware checks for password, stops flow & return 400 if password not provided
router.use("/", async (req, res, next) => {
  // console.log('in hasNotes');
  req.text = req.body.text;
  if (!req.text || JSON.stringify(req.text) === '{}' ) {
    res.status(400).send('Notes are required');
  } else {
    next();
  }
});

module.exports = router;