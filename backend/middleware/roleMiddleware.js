// @desc    Check if logged-in user has required role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    // 1. Check if user exists (set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authorized. Please log in first.',
      });
    }

    // 2. Check role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Only ${allowedRoles.join(' or ')} can do this.`,
      });
    }

    // 3. Allowed → continue
    next();
  };
};

module.exports = { authorizeRoles };