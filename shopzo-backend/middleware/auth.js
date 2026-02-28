import { verifyToken } from "../utils/jwt.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
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

export default authMiddleware;


