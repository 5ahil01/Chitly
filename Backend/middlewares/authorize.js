const authorize = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Authentication required.",
      });
    }

    if (role !== req.user.role) {
      console.log("Unauthorized role:", req.user.role);
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }
    next();
  };
};

export default authorize;
