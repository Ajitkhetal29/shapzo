import express from "express";
import { createWareHouse, getWareHouses } from "../controllers/warehouse.js";
import adminAuth from "../middleware/adminAuth.js";

const warehouseRouter = express.Router();

warehouseRouter.post("/create", adminAuth, createWareHouse);
warehouseRouter.get("/", adminAuth, getWareHouses);

export default warehouseRouter;
