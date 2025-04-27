import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./utils/db.connection.js";
import userRoutes from "./routes/user.routes.js";

// Load environment variables
dotenv.config();

// Check required environment variables
if (!process.env.PORT || !process.env.MONGO_URI) {
  throw new Error("Missing required environment variables.");
}

const app = express();
const port = process.env.PORT;

// CORS setup
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "X-Custom-Header"],
    credentials: true,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

// Built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to database
dbConnect();

// API routes
app.use("/api/v1/users", userRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
