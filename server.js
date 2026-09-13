import express from "express";
import connectDB from "./config/db.js";
import userAuthRoutes from "./routes/userAuth.js";


connectDB();

const port = process.env.PORT;

const app = express()
app.use(express.json());

app.use("/api/auth", userAuthRoutes)


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  
})


