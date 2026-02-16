import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { generateToken } from "../utils/jwt.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken({ id: user._id, role: user.role, name });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({ id: user._id, role: user.role , name: user.name});

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const createOpsUser = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;
    if (!name || !email || !password || !department || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, department, role });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user
    });
  } catch (error) {
    console.error("Create ops user error:", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }


  const getOpsUsers = async (req, res) => {
    try {
      const users = await User.find({ department: { $ne: "buyer" } });
      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        users
      });
    } catch (error) {
      console.error("Get ops users error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  const updateOpsUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, department, role } = req.body;
      const user = await User.findByIdAndUpdate(id, { name, email, department, role }, { new: true });
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user
      });
    } catch (error) {
      console.error("Update ops user error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  const deleteOpsUser = async (req, res) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete ops user error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

export { register, login, logout, createOpsUser, getOpsUsers, updateOpsUser, deleteOpsUser };