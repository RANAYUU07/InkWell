import express from "express";
import { createPost } from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";


// So here's our finalized endpoint list:

//1. POST /api/posts — Create a post (Author) → starts as draft
//2. PUT /api/posts/:id — Edit a post (Author, own, only if draft)
//3. PUT /api/posts/:id/submit — Submit for review (Author, own, draft → pending)
//4. PUT /api/posts/:id/approve — Approve (Editor, pending → published)
//5. PUT /api/posts/:id/reject — Reject (Editor, pending → rejected)
//6. GET /api/posts — List all published posts (public)
//7. GET /api/posts/:id — View single post (public if published)
//8. DELETE /api/posts/:id — Delete (Author if draft+own, OR Editor if published)

const router = express.Router()

router.post("/", protect, createPost)






