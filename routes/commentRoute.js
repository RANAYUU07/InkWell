import express from "express";
import {
  createComment,
  getCommentsForPost,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id", protect, createComment);
router.get("/:id", getCommentsForPost);
router.delete("/:commentId", protect, deleteComment);

export default router;
