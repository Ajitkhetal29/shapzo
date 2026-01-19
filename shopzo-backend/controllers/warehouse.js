import WareHouse from "../models/warehouse.js";

const createWareHouse = async (req, res) => {
  try {
    const { name, location, city, state, zipCode } = req.body;

    if (!name || !location || !city || !state || !zipCode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newWareHouse = new WareHouse({
      name,
      location,
      city,
      state,
      zipCode,
    });

    await newWareHouse.save();

    return res.status(201).json({
      success: true,
      message: "WareHouse created successfully",
      warehouse: newWareHouse,
    });
  } catch (error) {
    console.error("Create WareHouse error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getWareHouses = async (req, res) => {
  try {
    const warehouses = await WareHouse.find();
    return res.status(200).json({
      success: true,
      warehouses,
    });
  } catch (error) {
    console.error("Get WareHouses error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




export { createWareHouse, getWareHouses };
