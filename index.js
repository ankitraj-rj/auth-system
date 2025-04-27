import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./utils/db.connection.js";
import userRoutes from "./routes/user.routes.js";

// Load environment variables
dotenv.config();

// Check required environment variables
if (!process.env.PORT || !process.env.MONGO_URL) { // MONGO_URI nahi, MONGO_URL hai tumhare .env me
  throw new Error("Missing required environment variables (PORT or MONGO_URL).");
}

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// CORS setup
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
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

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error Stack:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
