import UserReporting from "../models/userReporting.js";
import User from "../models/user.js";
import Department from "../models/department.js";

export const createUserReporting = async (req, res) => {
  try {
    const { user, reportingTo, department } = req.body;

    if (!user || !reportingTo || !department) {
      return res.status(400).json({
        success: false,
        message: "User, reportingTo, and department are required",
      });
    }

    // Validate users exist
    const userDoc = await User.findById(user);
    const managerDoc = await User.findById(reportingTo);

    if (!userDoc || !userDoc.isActive) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive user",
      });
    }

    if (!managerDoc || !managerDoc.isActive) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive manager",
      });
    }

    // Validate department
    const dept = await Department.findById(department);
    if (!dept || !dept.isActive) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive department",
      });
    }

    // Check if user and manager belong to same department
    if (
      userDoc.department.toString() !== department ||
      managerDoc.department.toString() !== department
    ) {
      return res.status(400).json({
        success: false,
        message: "User and manager must belong to the same department",
      });
    }

    // Check if relationship already exists
    const existingReporting = await UserReporting.findOne({
      user,
      reportingTo,
      department,
    });

    if (existingReporting) {     
      return res.status(400).json({
        success: false,
        message: "Reporting relationship already exists",
      });
    }

    const userReporting = await UserReporting.create({
      user,
      reportingTo,
      department,
    });

    const populated = await UserReporting.findById(userReporting._id)
      .populate("user", "name email")
      .populate("reportingTo", "name email")
      .populate("department", "name");

    return res.status(201).json({
      success: true,
      message: "Reporting relationship created successfully",
      userReporting: populated,
    });

  } catch (error) {
    console.error("Create user reporting error:", error);
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

export const getUserReportings = async (req, res) => {
  try {
    const { user, reportingTo, department } = req.query;
    const filter = {};

    if (user) filter.user = user;
    if (reportingTo) filter.reportingTo = reportingTo;
    if (department) filter.department = department;

    const userReportings = await UserReporting.find(filter)
      .populate("user", "name email department role")
      .populate("reportingTo", "name email department role")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      userReportings,
    });
  } catch (error) {
    console.error("Get user reportings error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserReportingById = async (req, res) => {
  try {
    const { id } = req.params;

    const userReporting = await UserReporting.findById(id)
      .populate("user", "name email department role")
      .populate("reportingTo", "name email department role")
      .populate("department", "name");

    if (!userReporting) {
      return res.status(404).json({
        success: false,
        message: "Reporting relationship not found",
      });
    }

    return res.status(200).json({
      success: true,
      userReporting,
    });
  } catch (error) {
    console.error("Get user reporting error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserReporting = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, reportingTo, department } = req.body;

    const userReporting = await UserReporting.findById(id);
    if (!userReporting) {
      return res.status(404).json({
        success: false,
        message: "Reporting relationship not found",
      });
    }

    if (user) {
      const userDoc = await User.findById(user);
      if (!userDoc || !userDoc.isActive) {
        return res.status(400).json({
          success: false,
          message: "Invalid user",
        });
      }
      userReporting.user = user;
    }

    if (reportingTo) {
      const managerDoc = await User.findById(reportingTo);
      if (!managerDoc || !managerDoc.isActive) {
        return res.status(400).json({
          success: false,
          message: "Invalid manager",
        });
      }
      userReporting.reportingTo = reportingTo;
    }

    if (department) {
      const dept = await Department.findById(department);
      if (!dept || !dept.isActive) {
        return res.status(400).json({
          success: false,
          message: "Invalid department",
        });
      }
      userReporting.department = department;
    }

   
    await userReporting.save();

    const populated = await UserReporting.findById(userReporting._id)
      .populate("user", "name email")
      .populate("reportingTo", "name email")
      .populate("department", "name");

    return res.status(200).json({
      success: true,
      message: "Reporting relationship updated successfully",
      userReporting: populated,
    });
  } catch (error) {
    console.error("Update user reporting error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteUserReporting = async (req, res) => {
  try {
    const { id } = req.params;

    const userReporting = await UserReporting.findById(id);
    if (!userReporting) {
      return res.status(404).json({
        success: false,
        message: "Reporting relationship not found",
      });
    }

    // Soft delete
    userReporting.isActive = false;
    await userReporting.save();

    return res.status(200).json({
      success: true,
      message: "Reporting relationship deleted successfully",
    });
  } catch (error) {
    console.error("Delete user reporting error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
