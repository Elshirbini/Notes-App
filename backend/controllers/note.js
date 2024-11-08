import { Note } from "../models/note.js";

export const getNotes = async (req, res, next) => {
  try {
    const { user } = req.user;

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
  try {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: true, message: "Title and content is required" });
    }

    const note = await Note.create({
      title,
      content,
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
  try {
    const { noteId } = req.params;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
      return res
        .status(400)
        .json({ error: true, message: "No changes provided" });
    }
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: user._id },
      {
        title,
        content,
        tags,
        isPinned,
      },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

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
  try {
    const { noteId } = req.params;
    const { user } = req.user;
    const note = await Note.findOneAndDelete({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

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
  try {
    const { noteId } = req.params;
    const { isPinned } = req.body;
    const { user } = req.user;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: user._id },
      { isPinned: isPinned || false },
      { new: true, runValidators: true }
    );
    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

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
  try {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: true, message: "Search query is required" });
    }

    const regEx = new RegExp(query, "i");

    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [{ title: regEx }, { content: regEx }],
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
