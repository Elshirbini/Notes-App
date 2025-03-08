import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { User } from "../models/user.js";
import { Note } from "../models/note.js";
import { ApiError } from "../utils/apiError.js";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahmedalshirbini33@gmail.com",
    pass: "rvgedkbbviilneor",
  },
});

export const signup = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(errors.array()[0].msg, 400);
  }
  const mailOptions = {
    from: "ahmedalshirbini33@gmail.com",
    to: email,
    subject: "Welcome for you in my Notes APP",
    text: " Your account Created Successfully",
  };

  const hashedPass = await bcrypt.hash(password, 12);

  const user = await User.create({
    fullName,
    email,
    password: hashedPass,
  });

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return res.status(201).json({
    error: false,
    user,
    accessToken,
    message: "Registration Successfully",
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email and Password are required", 400);
  }

  const user = await User.findOne({ email: email });
  if (!user) throw new ApiError("User not found", 404);

  const hashedPass = await bcrypt.compare(password, user.password);
  if (!hashedPass) throw new ApiError("Wrong password", 401);

  const accessToken = jwt.sign(
    { user: user },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );
  return res.status(200).json({
    error: false,
    email,
    accessToken,
    message: "Login Successfully",
  });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const { user } = req.user;

  const userDoc = await User.findById(user._id);
  if (!userDoc) throw new ApiError("User not found", 404);

    res.status(200).json({
    user: {
      fullName: userDoc.fullName,
      email: userDoc.email,
      id: userDoc._id,
      createdAt: userDoc.createdAt,
    },
  });
});

export const sendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const token = crypto.randomBytes(3).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({ email: email });
  if (!user) throw new ApiError("User not found", 404);

  const mailOptions = {
    from: "ahmedalshirbini33@gmail.com",
    to: email,
    subject: "Reset Your Password",
    text: `Paste Your Verification code ${token} \n\nThis Verification code will be valid for 5 min`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      user.cryptoToken = undefined;
      user.cryptoTokenExpires = undefined;
      user.save();
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  const userData = await User.findByIdAndUpdate(
    user._id,
    {
      cryptoToken: hashedToken,
      cryptoTokenExpires: Date.now() + 5 * 60 * 1000,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ user: userData });
});

export const resendCode = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const token = crypto.randomBytes(3).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findById(userId);
  if (!user) throw new ApiError("This email has no account", 404);

  const mailOptions = {
    from: "ahmedalshirbini33@gmail.com",
    to: user.email,
    subject: "Password Reset",
    html: `
    <p>Copy The Code</p>
    <p>The code to reset your password <span>${token}</span> </p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      user.cryptoToken = undefined;
      user.cryptoTokenExpires = undefined;
      user.save();
    } else {
      console.log("Email sent: again " + info.response);
    }
  });

  const userData = await User.findByIdAndUpdate(
    userId,
    {
      cryptoToken: hashedToken,
      cryptoTokenExpires: Date.now() + 5 * 60 * 1000,
    },
    { new: true, runValidators: true }
  );

  return res.status(200).json({
    error: false,
    message: "Code sent again",
    user: userData,
  });
});

export const authCode = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { isCodeTrue } = req.body;

  const code = crypto.createHash("sha256").update(isCodeTrue).digest("hex");

  const user = await User.findOne({
    _id: userId,
    cryptoToken: code,
    cryptoTokenExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError("Wrong verification code ", 404);

  res.status(200).json({ message: "done", userId: userId });
});

export const newPassword = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(errors.array()[0].msg, 404);
  }

  const hashedPass = await bcrypt.hash(newPassword, 12);

  const isSet = await User.findOne({ _id: userId, password: hashedPass });
  if (isSet) throw new ApiError("This password is already set.", 400);

  const user = await User.findByIdAndUpdate(
    userId,
    {
      cryptoToken: null,
      cryptoTokenExpires: null,
      password: hashedPass,
    },
    { new: true, runValidators: true }
  );

  if (!user) throw new ApiError("User not found", 404);

  return res.status(200).json({
    error: false,
    user,
    message: "Password has been Changed successfully",
  });
});

export const deleteAcc = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { user } = req.user;

  const hashedPass = await bcrypt.compare(password, user.password);
  if (!hashedPass) throw new ApiError("Wrong password", 401);

  const userDoc = await User.findByIdAndDelete(user._id);
  if (!userDoc) throw new ApiError("User not found", 404);

  const notes = await Note.findOneAndDelete({ userId: user._id });
  if (!notes) throw new ApiError("Note not found", 404);

  res.status(200).json({
    message: "Account has been deleted",
  });
});
