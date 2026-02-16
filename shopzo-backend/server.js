import dotenv from "dotenv";
dotenv.config();
import express, { application } from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./middleware/auth.js";
import warehouseRouter from "./routes/warehouse.js";
import reverseGeocodeRouter from "./routes/reversegeocode.js";
import User from "./models/user.js";

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
app.use("/api/reversegeocode", reverseGeocodeRouter);
// this route is for home page and set user

app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User authenticated", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
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
