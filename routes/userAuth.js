import express from "express";
import { signUp, login } from "../controllers/authController.js";
import { loginValidator, signupValidator, validate } from "../middleware/validators.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", authLimiter, signupValidator, validate, signUp);

router.post("/login", authLimiter, loginValidator, validate, login);

export default router;
