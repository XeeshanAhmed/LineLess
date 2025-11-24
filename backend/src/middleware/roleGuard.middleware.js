export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.role)) {
        return res.status(403).json({ error: "Access denied: unauthorized role" });
      }
      next();
    };
  };
  