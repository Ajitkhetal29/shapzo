import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/create", adminAuth, createUser);
userRouter.get("/list", adminAuth, getUsers);
userRouter.get("/:id", adminAuth, getUserById);
userRouter.put("/update/:id", adminAuth, updateUser);
userRouter.delete("/delete/:id", adminAuth, deleteUser);

export default userRouter;
