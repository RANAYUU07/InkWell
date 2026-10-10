import express from "express"
import { createCategory, listAllCategory } from "../controllers/categoryController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

router.post("/", protect, createCategory) 
router.get("/", listAllCategory)

export default router 

