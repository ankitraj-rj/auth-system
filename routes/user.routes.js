import express from "express";
import {
  registerUser,
  verifyUser,
  login,
  getMe,
  logut,
} from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

// Register User (POST)
router.post("/register", registerUser);

// Verify User (GET with token)
router.get("/verify/:token", verifyUser);

// Login User (POST)
router.post("/login", login);

// Protected route to get user profile
router.post("/me", isLoggedIn, getMe);


router.post("/logout", logut);

export default router;
