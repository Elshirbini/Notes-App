import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { error } from "console";

var userId;
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahmedalshirbini33@gmail.com",
    pass: "rvgedkbbviilneor",
  },
});

export const signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  const mailOptions = {
    from: "ahmedalshirbini33@gmail.com",
    to: email,
    subject: "Welcome for you in my Notes APP",
    text: " Your account Created Successfully",
  };

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }
  try {
    const isUser = await User.findOne({ email: email });

    if (isUser) {
      return res.json({ error: true, message: "User already exist" });
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const user = new User({
      fullName: fullName,
      email: email,
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
    console.log(err);
    if (!err.statusCode === 500) {
      return (err.statusCode = 500);
    }
    next(err);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: true, message: "User Not Found" });
    }

    const hashedPass = await bcrypt.compare(password, user.password);
    if (!hashedPass) {
      return res.status(401).json({ error: true, message: "Wrong Password" });
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
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};

export const getUser = async (req, res, next) => {
  const { user } = req.user;

  try {
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
      return res.sendStatus(401);
    }

    return res.status(200).json({
      user: {
        fullName: isUser.fullName,
        email: isUser.email,
        id: isUser._id,
        createdAt: isUser.createdAt,
      },
      message: "",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};
var code;
var handleEmail;
export const sendCode = async (req, res, next) => {
  function generateCode() {
    var generatedCode;
    generatedCode = crypto.randomBytes(3).toString("hex");
    code = generatedCode;
    return code;
  }
  const { email } = req.body;
  handleEmail = email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "This email has no account",
      });
    }
    userId = user._id;
    const mailOptions = {
      from: "ahmedalshirbini33@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `
    <p>Copy The Code</p>
    <p>The code to reset your password <span>${generateCode()}</span> </p>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res.status(200).json({
      error: false,
      message: "sent",
    });
  } catch (error) {
    console.log(error);
  }
};

export const resendCode = async (req, res, next) => {
  function generateCode() {
    var generatedCode;
    generatedCode = crypto.randomBytes(3).toString("hex");
    code = generatedCode;
    return code;
  }
  try {
    const user = await User.findOne({ email: handleEmail });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "This email has no account",
      });
    }
    const mailOptions = {
      from: "ahmedalshirbini33@gmail.com",
      to: handleEmail,
      subject: "Password Reset",
      html: `
    <p>Copy The Code</p>
    <p>The code to reset your password <span>${generateCode()}</span> </p>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: again " + info.response);
      }
    });

    return res.status(200).json({
      error: false,
      message: "sentAgain",
    });
  } catch (error) {
    console.log(error);
  }
};

export const authCode = async (req, res, next) => {
  const { isCodeTrue } = req.body;

  if (isCodeTrue !== code) {
    return res.status(401).json({
      error: true,
      message: "fail",
    });
  }

  res.status(200).json({ message: "done", userId: userId });
};

export const newPassword = async (req, res, next) => {
  const userId = req.params.userId;
  const { newPassword } = req.body;
  if(newPassword === undefined){
    res.status(404).json({
      error : true ,
      message : 'Input field is empty'
    })
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "UserNotFound",
      });
    }
    const hashedPass = await bcrypt.hash(newPassword, 12);
    user.password = hashedPass;
    await user.save();
    return res.status(200).json({
      error: false,
      user,
      message: "Password has been Changed successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
