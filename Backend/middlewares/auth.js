import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const auth = async (req, res, next) => {
  try {
    const userType = req.headers["x-user-type"];
    if (!userType) {
      return res.status(400).json({
        success: false,
        message: "Missing X-User-Type header in request",
      });
    }

    const token = req.cookies[`${userType}_token`];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: `No token found for ${userType}`,
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is valid but user no longer exists.",
      });
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.user = user;

    next(); // move to next middleware or route handler
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export default auth;
