import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log("error connecting db", err);
    });
};

export default dbConnect;
