import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { createWarehouse, getWarehouses, updateWarehouse,deleteWarehouse } from "../controllers/warehouse.js";

const warehouseRouter = express.Router();
warehouseRouter.post("/create", adminAuth, createWarehouse);
warehouseRouter.get("/list", adminAuth, getWarehouses);
warehouseRouter.put("/update/:id", adminAuth, updateWarehouse); // public
warehouseRouter.delete("/delete/:id", adminAuth, deleteWarehouse); // public


export default warehouseRouter;
