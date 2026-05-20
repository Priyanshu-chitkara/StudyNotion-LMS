const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {

    // 🔥 Get token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }

    // 🔥 Extract token
    const token = authHeader.split(' ')[1];

    // 🔥 Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 🔥 Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // 🔥 Attach user
    req.user = user;

    next();

  } catch (error) {

    console.log("AUTH ERROR:", error);

    res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

module.exports = authMiddleware;