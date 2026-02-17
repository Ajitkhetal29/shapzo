import { verifyToken } from "../utils/jwt.js";


const adminAuth = (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== "superadmin") {
            return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
        }
        req.user = decoded; 
        next();
    } catch (error) {   
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default adminAuth;