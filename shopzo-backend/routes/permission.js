import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  createPermission,
  getPermissions,
  getPermissionById,
  getPermissionByRole,
  updatePermission,
  addPermissionToRole,
  removePermissionFromRole,
  deletePermission,
} from "../controllers/permission.js";

const permissionRouter = express.Router();

permissionRouter.post("/create", adminAuth, createPermission);
permissionRouter.get("/list", adminAuth, getPermissions);
permissionRouter.get("/role/:roleId", adminAuth, getPermissionByRole);
permissionRouter.get("/:id", adminAuth, getPermissionById);
permissionRouter.put("/update/:id", adminAuth, updatePermission);
permissionRouter.post("/:id/add", adminAuth, addPermissionToRole);
permissionRouter.post("/:id/remove", adminAuth, removePermissionFromRole);
permissionRouter.delete("/delete/:id", adminAuth, deletePermission);

export default permissionRouter;
