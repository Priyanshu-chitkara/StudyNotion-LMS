const transporter = require('../config/transporter');

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

    console.log('=================================');
    console.log('🔐 OTP:', otp);
    console.log('=================================');

    // ================= SEND EMAIL =================
    try {

      const info = await transporter.sendMail({

        from: "test@mailtrap.io",

        to: email,

        subject: "OTP Verification",

        text: `Your OTP is ${otp}`,

      });

      console.log("EMAIL SENT SUCCESSFULLY ✅");
      console.log(info);

    } catch (mailError) {

      console.log("MAIL ERROR ❌");
      console.log(mailError);

      return res.status(500).json({
        message: 'Failed to send OTP email',
      });
    }

    // ================= RESPONSE =================
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