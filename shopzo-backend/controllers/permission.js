import Permission from "../models/permission.js";
import Role from "../models/role.js";

export const createPermission = async (req, res) => {
  try {
    const { role, permissions } = req.body;

    if (!role || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "Role and permissions array are required",
      });
    }

    // Validate role exists
    const roleDoc = await Role.findById(role);
    if (!roleDoc || !roleDoc.isActive) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive role",
      });
    }

    // Check if permission already exists for this role
    const existingPermission = await Permission.findOne({ role });
    if (existingPermission) {
      return res.status(409).json({
        success: false,
        message: "Permission already exists for this role. Use update instead.",
      });
    }

    const permission = await Permission.create({
      role,
      permissions,
    });

    const populatedPermission = await Permission.findById(permission._id)
      .populate("role", "name department");

    return res.status(201).json({
      success: true,
      message: "Permission created successfully",
      permission: populatedPermission,
    });
  } catch (error) {
    console.error("Create permission error:", error);
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

export const getPermissions = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};

    if (role) filter.role = role;

    const permissions = await Permission.find(filter)
      .populate("role", "name department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      permissions,
    });
  } catch (error) {
    console.error("Get permissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findById(id).populate(
      "role",
      "name department"
    );

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    return res.status(200).json({
      success: true,
      permission,
    });
  } catch (error) {
    console.error("Get permission error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPermissionByRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    const permission = await Permission.findOne({ role: roleId }).populate(
      "role",
      "name department"
    );

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found for this role",
      });
    }

    return res.status(200).json({
      success: true,
      permission,
    });
  } catch (error) {
    console.error("Get permission by role error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, permissions } = req.body;

    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    if (role) {
      const roleDoc = await Role.findById(role);
      if (!roleDoc || !roleDoc.isActive) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }

      // Check if another permission exists for this role
      const existingPermission = await Permission.findOne({
        role,
        _id: { $ne: id },
      });
      if (existingPermission) {
        return res.status(409).json({
          success: false,
          message: "Permission already exists for this role",
        });
      }

      permission.role = role;
    }

    if (permissions !== undefined) {
      if (!Array.isArray(permissions)) {
        return res.status(400).json({
          success: false,
          message: "Permissions must be an array",
        });
      }
      permission.permissions = permissions;
    }

    await permission.save();

    const populatedPermission = await Permission.findById(permission._id)
      .populate("role", "name department");

    return res.status(200).json({
      success: true,
      message: "Permission updated successfully",
      permission: populatedPermission,
    });
  } catch (error) {
    console.error("Update permission error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addPermissionToRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission } = req.body;

    if (!permission) {
      return res.status(400).json({
        success: false,
        message: "Permission string is required",
      });
    }

    const permissionDoc = await Permission.findById(id);
    if (!permissionDoc) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    if (permissionDoc.permissions.includes(permission)) {
      return res.status(400).json({
        success: false,
        message: "Permission already exists",
      });
    }

    permissionDoc.permissions.push(permission);
    await permissionDoc.save();

    const populated = await Permission.findById(permissionDoc._id).populate(
      "role",
      "name department"
    );

    return res.status(200).json({
      success: true,
      message: "Permission added successfully",
      permission: populated,
    });
  } catch (error) {
    console.error("Add permission error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removePermissionFromRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission } = req.body;

    if (!permission) {
      return res.status(400).json({
        success: false,
        message: "Permission string is required",
      });
    }

    const permissionDoc = await Permission.findById(id);
    if (!permissionDoc) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    permissionDoc.permissions = permissionDoc.permissions.filter(
      (p) => p !== permission
    );
    await permissionDoc.save();

    const populated = await Permission.findById(permissionDoc._id).populate(
      "role",
      "name department"
    );

    return res.status(200).json({
      success: true,
      message: "Permission removed successfully",
      permission: populated,
    });
  } catch (error) {
    console.error("Remove permission error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    await Permission.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    console.error("Delete permission error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
