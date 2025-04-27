import express from "express";
import { registerUser, verifyUser, login } from "../controller/user.controller.js";

const router = express.Router();

// Register User (POST)
router.post("/register", registerUser);

// Verify User (GET with token)
router.get("/verify/:token", verifyUser);

// Login User (POST)
router.post("/login", login);

export default router;

