import asyncHandler from "express-async-handler";
import { Note } from "../models/note.js";
import { ApiError } from "../utils/apiError.js";

export const getNotes = asyncHandler(async (req, res, next) => {
  const { user } = req.user;

  const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
  if (!notes) throw new ApiError("Note not found", 404);

  return res.json({
    error: false,
    notes,
    message: "All notes retrieved",
  });
});
export const addNote = asyncHandler(async (req, res, next) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title || !content) {
    throw new ApiError("Title and content is required", 400);
  }

  const note = await Note.create({
    title,
    content,
    tags: tags || [],
    userId: user._id,
  });

  res.status(200).json({
    error: false,
    note,
    message: "Note added successfully",
  });
});
export const editNote = asyncHandler(async (req, res, next) => {
  const { noteId } = req.params;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    throw new ApiError("No changes provided", 404);
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

  if (!note) throw new ApiError("Note not found", 404);

  return res.status(200).json({
    error: false,
    note,
    message: "Note updated successfully",
  });
});
export const deleteNote = asyncHandler(async (req, res, next) => {
  const { noteId } = req.params;
  const { user } = req.user;

  const note = await Note.findOneAndDelete({ _id: noteId, userId: user._id });
  if (!note) throw new ApiError("Note not found", 404);

  return res.status(200).json({
    error: false,
    message: "Note deleted successfully",
  });
});

export const updateNotePinned = asyncHandler(async (req, res, next) => {
  const { noteId } = req.params;
  const { isPinned } = req.body;
  const { user } = req.user;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: user._id },
    { isPinned: isPinned || false },
    { new: true, runValidators: true }
  );
  if (!note) throw new ApiError("Note not found", 404);

  return res.status(200).json({
    error: false,
    note,
    message: "Note Pinned updated successfully",
  });
});

export const getSearchedNotes = asyncHandler(async (req, res, next) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) throw new ApiError("Search query is required", 400);

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
});
