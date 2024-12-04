import { Schema, model } from "mongoose";

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
    cryptoToken: String,
    cryptoTokenExpires: Date,
  },
  { timestamps: true }
);

export const User = model("users", user);
