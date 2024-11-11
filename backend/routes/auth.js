import express from "express";
import { body } from "express-validator";
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
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { User } from "../models/user.js";
const router = express.Router();

router.get("/get-user", authenticateToken, getUser);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email ")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email has already exist");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .isLength({ min: 5, max: 10 })
      .withMessage("Password length should be from 5 to 10 chars")
      .matches(/[a-z]/)
      .withMessage("Password should be contains chars from a to z ")
      .matches(/[A-Z]/)
      .withMessage("Password should be contains chars from A to Z ")
      .matches(/[0-9]/)
      .withMessage("Password should be contains numbers ")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password should be contains special chars "),
  ],
  signup
);

router.post("/login", login);

router.post("/sendcode", sendCode);

router.post("/resendcode/:userId", resendCode);

router.post("/authcode/:userId", authCode);

router.put(
  "/resetpass/:userId",
  [
    body("newPassword")
      .isLength({ min: 5, max: 10 })
      .withMessage("Password length should be from 5 to 10 chars")
      .matches(/[a-z]/)
      .withMessage("Password should be contains chars from a to z ")
      .matches(/[A-Z]/)
      .withMessage("Password should be contains chars from A to Z ")
      .matches(/[0-9]/)
      .withMessage("Password should be contains numbers ")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password should be contains special chars "),
  ],
  newPassword
);

router.delete("/deleteAcc", authenticateToken, deleteAcc);

export const authRoutes = router;
