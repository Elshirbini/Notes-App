import { connect } from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

export const DBConnection = () => {
  connect(process.env.MONGO_URL).then(() => {
    console.log("connected");
  });
};
