import Product from "../models/product.js";
import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import Vendor from "../models/vendor.js";
import { uploadImages } from "../utils/cloudinary.js";

const createProduct = async (req, res) => {
  const { name, description, categoryId, subcategoryId, vendorId, slug } = req.body;

  try {
    if (!name || !categoryId || !vendorId) {
      return res.status(400).json({
        success: false,
        message: "Name, category and vendor are required",
      });
    }
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug could not be generated from name",
      });
    }



    const existingCategory = await Category.findById(categoryId);
    const existingVendor = await Vendor.findById(vendorId);

    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!existingVendor) {
      return res.status(400).json({
        success: false,
        message: "vendor not found",
      });
    }

    let subcategory = null;
    if (subcategoryId) {
      const existingSub = await Subcategory.findById(subcategoryId);
      if (!existingSub) {
        return res.status(400).json({
          success: false,
          message: "Subcategory not found",
        });
      }
      if (String(existingSub.category) !== String(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Subcategory does not belong to the selected category",
        });
      }
      subcategory = subcategoryId;
    }

    let imageList = [];
    if (req.files?.length) {
      imageList = await uploadImages(req.files);
    }

    const product = new Product({
      name,
      slug,
      description: description ?? "",
      category: categoryId,
      subcategory: subcategory ?? undefined,
      vendor: vendorId,
      images: imageList,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product Added Successfully"
    })


  } catch (error) {
    console.error(error);
    const isCloudinaryConfig = error?.message?.includes("api_key") || error?.message?.includes("Must supply");
    res.status(500).json({
      success: false,
      message: isCloudinaryConfig
        ? "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env"
        : "Something went wrong while adding product.",
    });
  }

};

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, categoryId, subcategoryId, vendorId } = req.query;
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, Math.max(1, parseInt(limit, 10)));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const filter = {};
    if (categoryId) filter.category = categoryId;
    if (subcategoryId) filter.subcategory = subcategoryId;
    if (vendorId) filter.vendor = vendorId;

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .populate("vendor", "name contactNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      totalCount,
      page: parseInt(page, 10),
      limit: limitNum,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const productFound = await Product.findById(id)
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("vendor", "name");


    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product: productFound,
    });
  } catch (error) {
    console.error("Get product by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId, subcategoryId, vendorId, slug } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!name || !categoryId || !vendorId) {
      return res.status(400).json({
        success: false,
        message: "Name, category and vendor are required",
      });
    }
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const existingCategory = await Category.findById(categoryId);
    const existingVendor = await Vendor.findById(vendorId);

    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    if (!existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor not found",
      });
    }

    let subcategory = null;
    if (subcategoryId) {
      const existingSub = await Subcategory.findById(subcategoryId);
      if (!existingSub) {
        return res.status(400).json({
          success: false,
          message: "Subcategory not found",
        });
      }
      if (String(existingSub.category) !== String(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Subcategory does not belong to the selected category",
        });
      }
      subcategory = subcategoryId;
    }

    product.name = name;
    product.slug = slug.toLowerCase().trim();
    product.description = description ?? "";
    product.category = categoryId;
    product.subcategory = subcategory ?? undefined;
    product.vendor = vendorId;

    // Keep existing images by indices (from body.keepImageIndices JSON array), then append new uploads
    let keepIndices = [];
    try {
      if (typeof req.body.keepImageIndices === "string" && req.body.keepImageIndices) {
        keepIndices = JSON.parse(req.body.keepImageIndices);
      }
    } catch (_) {}
    const existingList = product.images || [];
    const keptExisting =
      Array.isArray(keepIndices) && keepIndices.length > 0
        ? keepIndices
            .filter((i) => Number.isInteger(i) && i >= 0 && i < existingList.length)
            .map((i) => existingList[i])
        : existingList;
    const newUploads = req.files?.length ? await uploadImages(req.files) : [];
    product.images = [...keptExisting, ...newUploads];

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update product error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Slug already in use by another product",
      });
    }
    const isCloudinaryConfig = error?.message?.includes("api_key") || error?.message?.includes("Must supply");
    return res.status(500).json({
      success: false,
      message: isCloudinaryConfig
        ? "Cloudinary is not configured."
        : "Internal server error",
    });
  }
};

export { createProduct, getProducts, deleteProduct, getProductById, updateProduct };
