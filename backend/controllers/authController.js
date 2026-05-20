const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =========================
// SIGNUP
// =========================
const signup = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      email,
      password,
      role,
    } = req.body;

    // ================= VALIDATION =================
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message: 'Please fill in all fields',
      });
    }

    // ================= CHECK USER =================
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    // ================= HASH PASSWORD =================
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // ================= CREATE USER =================
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'student',
    });

    // ================= RESPONSE =================
    return res.status(201).json({
      message: 'Account created successfully',

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error('SIGNUP ERROR:', error);

    return res.status(500).json({
      message: 'Server error. Please try again.',
    });
  }
};


// =========================
// LOGIN (OTP IN TERMINAL)
// =========================
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // ================= VALIDATION =================
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
      });
    }

    // ================= FIND USER =================
    const user = await User.findOne({
      email,
    });

    console.log('USER FOUND:', user);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // ================= PASSWORD CHECK =================
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // ================= GENERATE OTP =================
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;

    user.otpExpiry =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    // ================= SHOW OTP IN TERMINAL =================
    console.log('=================================');
    console.log('🔐 OTP:', otp);
    console.log('=================================');

    // ================= RESPONSE =================
    return res.status(200).json({
      message: 'OTP generated successfully',
      userId: user._id,
    });

  } catch (error) {

    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      message: 'Server error. Please try again.',
    });
  }
};


// =========================
// VERIFY OTP
// =========================
const verifyOtp = async (req, res) => {

  try {

    const { userId, otp } = req.body;

    // ================= FIND USER =================
    const user = await User.findById(userId);

    if (!user || user.otp !== otp) {

      return res.status(400).json({
        message: 'Invalid OTP',
      });
    }

    // ================= CHECK EXPIRY =================
    if (user.otpExpiry < Date.now()) {

      return res.status(400).json({
        message: 'OTP expired',
      });
    }

    // ================= CLEAR OTP =================
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // ================= GENERATE JWT =================
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn:
          process.env.JWT_EXPIRES_IN,
      }
    );

    // ================= RESPONSE =================
    return res.status(200).json({

      message: 'Login successful',

      token,

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },

    });

  } catch (error) {

    console.error('OTP ERROR:', error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};


module.exports = {
  signup,
  login,
  verifyOtp,
};