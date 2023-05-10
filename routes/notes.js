const { Router } = require("express");
const noteDAO = require('../daos/note');
const isLoggedIn = require('../middleware/isLoggedIn');
const hasNotes = require('../middleware/hasNotes');
const router = Router();

// Create `POST /notes`
router.post("/", isLoggedIn, hasNotes, async (req, res, next) => {
  const newNote = {
    "userId": req.userId,
    "text": req.text
  };
  try {
    const noteCreated = await noteDAO.createNote(newNote);
    // console.log('note created: ', noteCreated);
    res.status(200).json(noteCreated); 
  } catch(e) {
    // console.log('error', e);
    res.status(500).send(e.message);
  }
});

// Get a single note: `GET /notes/:id`
router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    req.note = await noteDAO.getNote(req.userId, req.params.id);
    if (!req.note) {
      // console.log(`No NoteID: ${req.note}`);
      res.status(404).send('Note Id is not valid');
    } else {
      // console.log(`Good Note; userID:${req.userId}, note_id:${req.params.id}, note:${req.note.text}`);
      res.status(200).json(req.note);
    }
  } catch (e) {
    // console.log(`ID caught something: ${e}`);
    // ID caught something: CastError: Cast to ObjectId failed for value "123" (type string) at path "_id" for model "notes"
    res.status(400).send(`validateNoteId middleware error: ${e.message}`);
  }
});

//  Get all of my notes: `GET /notes`
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const note = await noteDAO.getUserNotes(req.userId);
    res.status(200).json(note);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
