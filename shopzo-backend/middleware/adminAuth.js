import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.js";
import Department from "../models/department.js";
import Role from "../models/role.js";

// Cache admin department and super admin role IDs
let adminDepartmentId = null;
let superAdminRoleId = null;

const getAdminIds = async () => {
  if (adminDepartmentId && superAdminRoleId) {
    return { adminDepartmentId, superAdminRoleId };
  }

  // Find Admin department
  const adminDept = await Department.findOne({ name: { $regex: /^admin$/i } });
  if (!adminDept) {
    throw new Error("Admin department not found");
  }

  // Find Super Admin role in Admin department
  const superAdminRole = await Role.findOne({ 
    name: { $regex: /^super\s*admin$/i },
    department: adminDept._id 
  });
  if (!superAdminRole) {
    throw new Error("Super Admin role not found");
  }

  adminDepartmentId = adminDept._id;
  superAdminRoleId = superAdminRole._id;

  return { adminDepartmentId, superAdminRoleId };
};

const adminAuth = async (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      
      const decoded = verifyToken(token);
      
      if (!decoded || !decoded.id) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }

      // Get admin IDs
      const { adminDepartmentId, superAdminRoleId } = await getAdminIds();

      // Fetch user
      const user = await User.findById(decoded.id);
      
      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, message: "User not found or inactive" });
      }

      // Check if user's department and role IDs match admin department and super admin role
      const isAdminDept = user.department?.toString() === adminDepartmentId.toString();
      const isSuperAdminRole = user.role?.toString() === superAdminRoleId.toString();
      
      if (!isAdminDept || !isSuperAdminRole) {
        return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
      }

      // Populate for req.user
      const populatedUser = await User.findById(user._id)
        .populate("role", "name")
        .populate("department", "name");

      req.user = {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        department: populatedUser.department
      };
      
      next();
    } catch (error) {
      console.error("Admin auth error:", error.message || error);
      
      // Handle specific JWT errors
      if (error.message?.includes("JWT_SECRET is not configured")) {
        return res.status(500).json({ 
          success: false, 
          message: "Server configuration error" 
        });
      }
      
      if (error.message?.includes("invalid signature")) {
        return res.status(401).json({ 
          success: false, 
          message: "Session expired. Please log in again." 
        });
      }
      
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export default adminAuth;