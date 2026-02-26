import Role from "../models/role.js";
import Department from "../models/department.js";

export const createRole = async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({
        success: false,
        message: "Role name and department are required",
      });
    }

    // Validate department exists
    const dept = await Department.findById(department);
    if (!dept || !dept.isActive) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive department",
      });
    }

    // Check if role already exists for this department
    const existingRole = await Role.findOne({ name, department });
    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: "Role already exists for this department",
      });
    }

    const role = await Role.create({
      name,
      department,
    });

    const populatedRole = await Role.findById(role._id).populate(
      "department",
      "name"
    );

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      role: populatedRole,
    });
  } catch (error) {
    console.error("Create role error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRoles = async (req, res) => {
  try {
    const { department, isActive } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const roles = await Role.find(filter)
      .populate("department", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      roles,
    });
  } catch (error) {
    console.error("Get roles error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id).populate("department", "name");

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    console.error("Get role error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, isActive } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    if (name) {
      // Check if role name already exists for the department
      const departmentId = department || role.department;
      const existingRole = await Role.findOne({
        name,
        department: departmentId,
        _id: { $ne: id },
      });
      if (existingRole) {
        return res.status(409).json({
          success: false,
          message: "Role name already exists for this department",
        });
      }
      role.name = name;
    }

    if (department) {
      const dept = await Department.findById(department);
      if (!dept || !dept.isActive) {
        return res.status(400).json({
          success: false,
          message: "Invalid department",
        });
      }
      role.department = department;
    }

    if (typeof isActive === "boolean") {
      role.isActive = isActive;
    }

    await role.save();

    const populatedRole = await Role.findById(role._id).populate(
      "department",
      "name"
    );

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role: populatedRole,
    });
  } catch (error) {
    console.error("Update role error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Soft delete
    role.isActive = false;
    await role.save();

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Delete role error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



