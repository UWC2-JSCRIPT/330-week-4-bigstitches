const Note = require('../models/note');

module.exports = {};

// createNote(userId, noteObj) - should create a note for the given user
module.exports.createNote = (noteObj) => {
  return Note.create(noteObj);
}
// getNote(userId, noteId) - should get note for userId and noteId (_id)
module.exports.getNote = (userId, noteId) => {
  return Note.findOne({ userId: userId, _id:noteId })
}
// getUserNotes(userId) - should get all notes for userId
module.exports.getUserNotes = (userId) => {
  return Note.find({ userId: userId });
}