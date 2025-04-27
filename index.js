import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./utils/db.connection.js";
import cookieParser from "cookie-parser";

// importing all router
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "X-Custom-Header"],
    credentials: true,
    maxAge: 86400, // means 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// db connection.
dbConnect();

// user routes

app.use("/api/v1/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`);
});
