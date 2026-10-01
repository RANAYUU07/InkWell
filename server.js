import express from "express";
import connectDB from "./config/db.js";
import userAuthRoutes from "./routes/userAuth.js";
import postRoutes from "./routes/postRoute.js"
import commentRoute from "./routes/commentRoute.js"
import likeRoute from "./routes/likeRoute.js"

connectDB();

const port = process.env.PORT;

const app = express()
app.use(express.json());

app.use("/api/auth", userAuthRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoute)
app.use("/api/likes", likeRoute)


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  
})


