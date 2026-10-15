import express from "express"
import { createCategory, listAllCategory } from "../controllers/categoryController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", protect, createCategory) 
router.get("/", listAllCategory)

export default router 

