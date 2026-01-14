import { verifyToken } from "../utils/jwt.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = decoded;
    next();
  } catch (error) {

    return res.status(401).json({ success: false, message: "Unauthorized", error: error.message });
  }
};

export default authMiddleware;


