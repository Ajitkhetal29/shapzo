import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "../controllers/role.js";

const roleRouter = express.Router();

roleRouter.post("/create", adminAuth, createRole);
roleRouter.get("/list", adminAuth, getRoles);
roleRouter.get("/:id", adminAuth, getRoleById);
roleRouter.put("/update/:id", adminAuth, updateRole);
roleRouter.delete("/delete/:id", adminAuth, deleteRole);

export default roleRouter;
