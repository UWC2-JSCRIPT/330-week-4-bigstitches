const { Router } = require("express");
const router = Router();
const noteDAO = require('../daos/note');
// NOT USED
// Middleware find note id, if exists, returns 400 if doesn't exist
// returns the note text if it does... probably should be an endpoint
// design questions
router.use("/", async (req, res, next) => {
  // console.log('In isLoggedIn');
  try {
    req.note = await noteDAO.getNote(req.userId, req.params.id);
    if (!req.note) {
      res.status(400).send('Note Id is not valid');
    } else {
      next();
    }
  } catch (e) {
    res.status(500).send(`validateNoteId middleware error: ${e.message}`);
  }
});

module.exports = router;