import express from "express";
import { loginUser, registerUser } from "../controller/user.controller.js";

const router = express.Router();

router.get("/register", registerUser);
router.get("/login", loginUser);

export default router;
