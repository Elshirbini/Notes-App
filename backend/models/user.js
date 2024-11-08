import mongoose from "mongoose";

const Schema = mongoose.Schema;

const user = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cryptoToken: {
      type: String,
    },
    cryptoTokenExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("users", user);
