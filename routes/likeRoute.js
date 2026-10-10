import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getNumberOfLikesForPost, toggleLike } from "../controllers/likeController.js";

const router = express.Router()

router.get("/:id/count", getNumberOfLikesForPost)
router.post("/:id", protect, toggleLike)


export default router