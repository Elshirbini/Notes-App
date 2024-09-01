import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";

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
    if(!err.statusCode === 500 ){
      return err.statusCode = 500
    }
    next(err)
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

export const resetPass = async (req, res, next) => {
  const { email } = req.body;


  try {
    const user = await  User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "This email has no account",
      });
    }

    const mailOptions = {
      from: "ahmedalshirbini33@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `
    <p>You requested a password reset</p>
    <p>Click this <a href='http://localhost:3000/reset/${user._id}'>link</a> to set a new password</p>
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
      message: "Reset password link is sent",
      user: userReset,
    });
  } catch (error) {
    console.log(error);
  }
};


export const newPassword = async(req,res,next) => {
  const userId = req.params.userId
  const {password} = req.body

  try{
    const user = await User.findById(userId)
    if(!user){
      return res.status(401).json({
        message : "An Error occurred"
      })
    }
    const hashedPass = await bcrypt.hash(password ,12)
    user.password = hashedPass
    await user.save()
    return res.status(200).json({
      error : false,
      user,
      message : "Password has been Changed successfully"
    })

  }catch(error){
    console.log(error)
  }
}