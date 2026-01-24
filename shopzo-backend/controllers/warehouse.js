import Warehouse from "../models/warehouse.js";

export const createWarehouse = async (req, res) => {
  try {
    const { name, location, address } = req.body;

    if (
      !name ||
      !location?.lat ||
      !location?.lng ||
      !address?.formatted ||
      !address?.state ||
      !address?.city ||
      !address?.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Required warehouse data missing",
      });
    }

    const warehouse = await Warehouse.create({
      name,
      location,
      address,
      createdBy: req.user.id, // from auth middleware
    });

    return res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      warehouse,
    });
  } catch (error) {
    console.error("Create warehouse error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ isActive: true })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      warehouses,
    });
  } catch (error) {
    console.error("Get warehouses error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, address, isActive } = req.body;

    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    if (name) warehouse.name = name;

    if (location?.lat !== undefined && location?.lng !== undefined) {
      warehouse.location = location;
    }

    if (address) warehouse.address = address;

    if (typeof isActive === "boolean") {
      warehouse.isActive = isActive;
    }

    await warehouse.save();

    return res.status(200).json({
      success: true,
      message: "Warehouse updated successfully",
      warehouse,
    });
  } catch (error) {
    console.error("Update warehouse error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

