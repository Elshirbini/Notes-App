import express from "express";
import { login, signup , getUser } from "../controllers/auth.js";
import { authenticateToken } from "../utilities.js";

const router = express.Router();

router.get('/get-user' , authenticateToken , getUser)

router.post("/signup", signup);

router.post("/login", login);

export const authRoutes = router;
