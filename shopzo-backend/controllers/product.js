import Product from "../models/product.js";
import Category from "../models/category.js";
import Vendor from "../models/vendor.js";

const createProduct = async (req, res) => {
  const { name, description, categoryId, vendorId } = req.body;

  console.log("req body", req.body);

    try {
        
  if (!name || !categoryId || !vendorId) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }

  const exisingCategory = await Category.findById(categoryId);

  const existingVendor = await Vendor.findById(vendorId);

  if (!exisingCategory) {
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

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  const slug = await generateSlug(name);

  const product = new Product({
    name,
    slug,
    description: description ? description : "",
    category: exisingCategory,
    vendor: vendorId,
  });

  await product.save();

  res.status(201).json({
    success : true,
    message : "Product Added Successfully"
  })

  
    } catch (error) {
        console.error(error)
        res.status(401).json({
            success : false,
            message :"Some eroor occured while adding product."
        })
        
    }

};

export { createProduct };
