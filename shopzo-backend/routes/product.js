import express from "express";
import upload from "../config/multer.js";
import { createProduct, getProducts, deleteProduct, getProductById, updateProduct } from "../controllers/product.js";

const productRouter = express.Router();

productRouter.get("/list",  getProducts);
productRouter.post("/add",  upload.array("images", 10), createProduct);
productRouter.delete("/delete/:id",  deleteProduct);
productRouter.get("/:id",  getProductById);
productRouter.put("/update/:id",  upload.array("images", 10), updateProduct);

export default productRouter;
