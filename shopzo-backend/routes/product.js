import express from "express";

import { createProduct } from "../controllers/product";
import adminAuth from "../middleware/adminAuth";

const productRouter = express.Router();

productRouter.post("add", adminAuth, createProduct);

export default productRouter;
