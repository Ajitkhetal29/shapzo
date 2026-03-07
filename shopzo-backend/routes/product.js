import express from "express";
import upload from "../config/multer.js";
import { createProduct, getProducts, deleteProduct, getProductById, updateProduct } from "../controllers/product.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.get("/list", adminAuth, getProducts);
productRouter.post("/add", adminAuth, upload.array("images", 10), createProduct);
productRouter.delete("/delete/:id", adminAuth, deleteProduct);
productRouter.get("/:id", adminAuth, getProductById);
productRouter.put("/update/:id", adminAuth, upload.array("images", 10), updateProduct);

export default productRouter;
