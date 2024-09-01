import express from "express";
import { login, signup, getUser, resetPass, newPassword } from "../controllers/auth.js";
import { authenticateToken } from "../utilities.js";

const router = express.Router();

router.get("/get-user", authenticateToken, getUser);

router.post("/signup", signup);

router.post("/login", login);

router.post("/reset", resetPass);

router.post("/reset/:userId" , newPassword);

export const authRoutes = router;
