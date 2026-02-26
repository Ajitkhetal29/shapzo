import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} from "../controllers/vendor.js";

const vendorRouter = express.Router();

vendorRouter.post("/create", adminAuth, createVendor);
vendorRouter.get("/list", adminAuth, getVendors);
vendorRouter.get("/:id", adminAuth, getVendorById);
vendorRouter.put("/update/:id", adminAuth, updateVendor);
vendorRouter.delete("/delete/:id", adminAuth, deleteVendor);

export default vendorRouter;
