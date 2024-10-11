import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRoutes } from "./routes/auth.js";
import { noteRoutes } from "./routes/note.js";
const app = express();

app.use(
  cors({
    // origin: "https://notes-app-front-delta.vercel.app",
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.get("/", (req, res, next) => {
  res.json("Hello World");
});

app.use(authRoutes);
app.use(noteRoutes);

mongoose
  // .connect(process.env.MONGO_URL)
  .connect("mongodb+srv://Elshirbini:Aa5527980098@cluster0.ufoahrq.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => app.listen(8000, () => console.log("Connected")));
