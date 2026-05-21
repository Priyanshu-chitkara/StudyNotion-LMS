const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const transporter = require('../config/transporter');


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

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'student',
    });

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
// LOGIN
// =========================
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({
      email,
    });

    console.log('USER FOUND:', user);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;

    user.otpExpiry =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log('🔐 OTP:', otp);

    // SEND MAIL
    try {

      const info = await transporter.sendMail({

        from: "test@mailtrap.io",

        to: email,

        subject: "OTP Verification",

        text: `Your OTP is ${otp}`,

      });

      console.log("EMAIL SENT SUCCESSFULLY ✅");

    } catch (mailError) {

      console.log("MAIL ERROR ❌");

      console.log(mailError);

      return res.status(500).json({
        message: 'Failed to send OTP email',
      });
    }

    return res.status(200).json({
      message: 'OTP sent successfully',
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

    const user = await User.findById(userId);

    if (!user || user.otp !== otp) {

      return res.status(400).json({
        message: 'Invalid OTP',
      });
    }

    if (user.otpExpiry < Date.now()) {

      return res.status(400).json({
        message: 'OTP expired',
      });
    }

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '7d',
      }
    );

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