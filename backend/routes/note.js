import express from "express";

import { authenticateToken } from "../utilities.js";
import {
  addNote,
  deleteNote,
  editNote,
  getNotes,
  updateNotePinned,
  getSearchedNotes
} from "../controllers/note.js";
const router = express.Router();

router.get("/get-all-notes", authenticateToken, getNotes);

router.post("/add-note", authenticateToken, addNote);

router.put("/edit-note/:noteId", authenticateToken, editNote);

router.delete("/delete-note/:noteId", authenticateToken, deleteNote);

router.patch("/update-note-pinned/:noteId", authenticateToken, updateNotePinned);

router.get("/search-notes/", authenticateToken, getSearchedNotes);

export const noteRoutes = router;
