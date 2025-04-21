import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./utils/db.connection.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:300",
    methods:["GET","POST","PUT","DELETE"],
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// db connection
dbConnect();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
