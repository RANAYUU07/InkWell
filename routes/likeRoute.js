import express from "express";
import { protect } from "../middleware/authMiddleware";
import { toggleLike } from "../controllers/likeController";

const router = express.Router()

router.post("/:id", protect, toggleLike)

export default router