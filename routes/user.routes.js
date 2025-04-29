import express from "express";
import {
  registerUser,
  verifyUser,
  login,
  getMe,
} from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

// Register User (POST)
router.post("/register", registerUser);

// Verify User (GET with token)
router.get("/verify/:token", verifyUser);

// Login User (POST)
router.post("/login", login);

router.post("/me", isLoggedIn, getMe);

export default router;
