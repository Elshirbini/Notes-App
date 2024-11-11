import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
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

export const signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array()[0].msg, 400));
  }
  const mailOptions = {
    from: "ahmedalshirbini33@gmail.com",
    to: email,
    subject: "Welcome for you in my Notes APP",
    text: " Your account Created Successfully",
  };

  try {
    const hashedPass = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName,
      email,
      password: hashedPass,
    });

    await user.save();

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

    return res.status(200).json({
      error: false,
      user,
      accessToken,
      message: "Registration Successfully",
    });
  } catch (err) {
    next(new ApiError(err, 500));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError("Email and Password are required", 400));
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    const hashedPass = await bcrypt.compare(password, user.password);
    if (!hashedPass) {
      return next(new ApiError("Wrong password", 401));
    }
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
  } catch (err) {
    next(new ApiError(err, 500));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { user } = req.user;

    const userDoc = await User.findById(user._id);

    if (!userDoc) {
      return next(new ApiError("User not found", 404));
    }

    return res.status(200).json({
      user: {
        fullName: userDoc.fullName,
        email: userDoc.email,
        id: userDoc._id,
        createdAt: userDoc.createdAt,
      },
    });
  } catch (err) {
    next(new ApiError(err, 500));
  }
};

export const sendCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(3).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ email: email });
    if (!user) {
      return next(new ApiError("User not found", 404));
    }

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
  } catch (error) {
    next(new ApiError(error, 500));
  }
};

export const resendCode = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const token = crypto.randomBytes(3).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError("This email has no account", 404));
    }

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

    const userData = await User.findByIdAndUpdate(userId, {
      cryptoToken: hashedToken,
      cryptoTokenExpires: Date.now() + 5 * 60 * 1000,
    });

    return res.status(200).json({
      error: false,
      message: "Code sent again",
      user: userData,
    });
  } catch (error) {
    next(new ApiError(error, 500));
  }
};

export const authCode = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isCodeTrue } = req.body;

    const code = crypto.createHash("sha256").update(isCodeTrue).digest("hex");

    const user = await User.findOne({
      _id: userId,
      cryptoToken: code,
      cryptoTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ApiError("Wrong verification code ", 404));
    }

    res.status(200).json({ message: "done", userId: userId });
  } catch (error) {
    next(new ApiError(error, 500));
  }
};

export const newPassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new ApiError(errors.array()[0].msg, 404));
    }

    const hashedPass = await bcrypt.hash(newPassword, 12);

    const isSet = await User.findOne({ _id: userId, password: hashedPass });

    if (isSet) {
      return next(new ApiError("This password is already set.", 400));
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        cryptoToken: null,
        cryptoTokenExpires: null,
        password: hashedPass,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    return res.status(200).json({
      error: false,
      user,
      message: "Password has been Changed successfully",
    });
  } catch (error) {
    next(new ApiError(error, 500));
  }
};

export const deleteAcc = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { user } = req.user;

    const hashedPass = await bcrypt.compare(password, user.password);
    if (!hashedPass) {
      return next(new ApiError("Wrong password", 401));
    }
    const userDoc = await User.findByIdAndDelete(user._id);
    const notes = await Note.findOneAndDelete({ userId: user._id });
    if (!userDoc) {
      return next(new ApiError("User not found", 404));
    }
    if (!notes) {
      return next(new ApiError("Note not found", 404));
    }

    res.status(200).json({
      message: "Account has been deleted",
    });
  } catch (error) {
    next(new ApiError(error, 500));
  }
};
