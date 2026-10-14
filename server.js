import "./config/env.js";
import express from "express";
import connectDB from "./config/db.js";
import userAuthRoutes from "./routes/userAuth.js";
import postRoutes from "./routes/postRoute.js"
import commentRoute from "./routes/commentRoute.js"
import likeRoute from "./routes/likeRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import helmet from "helmet";
import cors from "cors";
import { apiLimiter } from "./middleware/rateLimiters.js";
import morgan from "morgan";

connectDB();

const port = process.env.PORT || 8000;

const app = express()


app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); 
// helmet is a middleware that helps secure your Express apps by setting various HTTP headers. In this case, the crossOriginResourcePolicy is set to "cross-origin", which allows resources to be shared across different origins. This is particularly useful when your frontend and backend are hosted on different domains or ports, as it enables the frontend to access resources from the backend without running into CORS (Cross-Origin Resource Sharing) issues. here the cross origin is concerning images, so if you have an image on your backend and you want to display it on your frontend, this setting will allow that to happen without any issues.


app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
// cors is a middleware that allows you to configure your server to accept requests from different origins. In this case, it's set to accept requests from the URL specified in the CLIENT_URL environment variable, or "http://localhost:5173". This is important for enabling communication between your frontend and backend when they are hosted on different domains or ports.

app.use(express.json());


app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")); // logs all teh requests the server actually recieves, including the method, url, status code, and response time. In production, it uses teh "combined" format, which is more detailed so if something goes wrong, you can see what happened in the logs. In development, it uses the "dev" format, which is more concise and easier to read.

app.use("/api", apiLimiter); // puts a limiter for login attempts on all routes under /api

app.use("/api/auth", userAuthRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoute)
app.use("/api/likes", likeRoute)
app.use("/api/categories", categoryRoute)
app.use("/uploads", express.static("uploads"));


app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  
})


