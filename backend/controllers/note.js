import { Note } from "../models/note.js";
import { User } from "../models/user.js";

export const getNotes = async (req, res, next) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    if (!notes) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};
export const addNote = async (req, res, next) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title: title,
      content: content,
      tags: tags || [],
      userId: user._id,
    });
    await note.save();

    res.status(200).json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};
export const editNote = async (req, res, next) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.status(200).json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};
export const deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    await note.deleteOne({ _id: noteId, userId: user._id });
    return res.status(200).json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};

export const updateNotePinned = async (req, res, next) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned || false;

    await note.save();

    return res.status(200).json({
      error: false,
      note,
      message: "Note Pinned updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};

export const getSearchedNotes = async (req, res, next) => {
  const { user } = req.user;
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }
  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};
