import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.js";
import { noteRoutes } from "./routes/note.js";
import { ApiError } from "./utils/apiError.js";
import { errorHandling } from "./middlewares/errorHandling.js";
import { DBConnection } from "./config/connectionDB.js";
const app = express();

app.use(
  cors({
    origin: "https://notes-app-two-blue.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use("/favicon.ico", express.static("./favicon.ico"));

app.use(express.json());
app.get("/", (req, res, next) => {
  res.json("Hello World!!!");
});

app.use(authRoutes);
app.use(noteRoutes);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400));
});

app.use(errorHandling);

app.listen(8000, () => {
  DBConnection();
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errors : ${err.name} | ${err.message}`);
  process.exit(1);
});
