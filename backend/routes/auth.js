import express from "express";
import {
  login,
  signup,
  getUser,
  newPassword,
  sendCode,
  authCode,
} from "../controllers/auth.js";
import { authenticateToken } from "../utilities.js";

const router = express.Router();

router.get("/get-user", authenticateToken, getUser);

router.post("/signup", signup);

router.post("/login", login);

router.post("/sendcode", sendCode);

router.post("/reset/:userId", newPassword);

router.post("/authcode", authCode);

export const authRoutes = router;
