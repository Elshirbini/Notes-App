import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Note } from "../models/note.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "Email and Password are required" });
    }

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
  try {
    const { user } = req.user;

    const userDoc = await User.findById(user._id);

    if (!userDoc) {
      return res.status(401).json({ error: "User not found" });
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
    console.log(err);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};

// export const sendCode = async (req, res, next) => {
//   function generateCode() {
//     var generatedCode;
//     generatedCode = crypto.randomBytes(3).toString("hex");
//     code = generatedCode;
//     return code;
//   }
//   const { email } = req.body;
//   handleEmail = email;
//   try {
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       return res.status(404).json({
//         error: true,
//         message: "This email has no account",
//       });
//     }
//     userId = user._id;
//     const mailOptions = {
//       from: "ahmedalshirbini33@gmail.com",
//       to: email,
//       subject: "Password Reset",
//       html: `
//     <p>Copy The Code</p>
//     <p>The code to reset your password <span>${generateCode()}</span> </p>
//     `,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });

//     return res.status(200).json({
//       error: false,
//       message: "sent",
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const sendCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(3).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
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
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};

export const resendCode = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const token = crypto.randomBytes(3).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "This email has no account",
      });
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
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
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
      return res.status(404).json({ error: "Wrong verification code " });
    }

    res.status(200).json({ message: "done", userId: userId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};

export const newPassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).json({ error: errors.array()[0].msg });
    }

    const hashedPass = await bcrypt.hash(newPassword, 12);

    const isSet = await User.findOne({ _id: userId, password: hashedPass });

    if (isSet) {
      return res.status(400).json({ error: "This password is already set." });
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
      return res.status(401).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      error: false,
      user,
      message: "Password has been Changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};

export const deleteAcc = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { user } = req.user;

    const hashedPass = await bcrypt.compare(password, user.password);
    if (!hashedPass) {
      return res.status(401).json({
        message: "Password is false",
      });
    }
    const userDoc = await User.findByIdAndDelete(user._id);
    const notes = await Note.findOneAndDelete({ userId: user._id });
    if (!userDoc) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    if (!notes) {
      return res.status(404).json({
        message: "Notes Not Found",
      });
    }

    res.status(200).json({
      message: "Account has been deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Internal Error",
    });
  }
};
