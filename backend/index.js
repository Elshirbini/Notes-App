import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRoutes } from "./routes/auth.js";
import { noteRoutes } from "./routes/note.js";
const app = express();


app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use('/' , (req,res,next) => {
  res.send("server running")
})

app.use(authRoutes);
app.use(noteRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => app.listen(8000, () => console.log("Connected")));
