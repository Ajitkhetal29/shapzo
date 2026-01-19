import dotenv from "dotenv";
dotenv.config();
import express, { application } from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./middleware/auth.js";
import warehouseRouter from "./routes/warehouse.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/warehouse", warehouseRouter);
// this route is for home page and set user

app.get("/api/me", authMiddleware, (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "User authenticated", user: req.user });
});

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome to Shapzo Backend " });
});

// db connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
