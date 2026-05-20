const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ✅ Only instructor can access
router.get(
  '/instructor',
  authMiddleware,
  authorizeRoles('instructor'),
  (req, res) => {
    res.json({
      message: 'Welcome Instructor',
      user: req.user
    });
  }
);

// ✅ Both can access
router.get(
  '/common',
  authMiddleware,
  authorizeRoles('student', 'instructor'),
  (req, res) => {
    res.json({
      message: 'Welcome Student or Instructor',
      user: req.user
    });
  }
);

module.exports = router;