import express from "express";
import {
  login,
  signup,
  getUser,
  newPassword,
  sendCode,
  authCode,
  resendCode,
  deleteAcc,
} from "../controllers/auth.js";
import { authenticateToken } from "../utilities.js";

const router = express.Router();

router.get("/get-user", authenticateToken, getUser);

router.post("/signup", signup);

router.post("/login", login);

router.post("/sendcode", sendCode);

router.post("/resendcode", resendCode);

router.post("/authcode", authCode);

router.put("/resetpass/:userId", newPassword);

router.delete("/deleteAcc" ,authenticateToken , deleteAcc);

export const authRoutes = router;
