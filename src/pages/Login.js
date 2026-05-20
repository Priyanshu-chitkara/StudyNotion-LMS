import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import API from '../services/api';

function Login() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post('/auth/login', form);

      // 🔥 SAVE USER ID
      localStorage.setItem('userId', res.data.userId);

      // 🔥 SAVE EMAIL
      localStorage.setItem('email', form.email);

      toast.success('OTP sent successfully 📩');

      setTimeout(() => {
        navigate('/verify-otp');
      }, 1200);

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        'Login failed ❌'
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= UI =================
  return (

    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] flex justify-center items-center p-6 overflow-hidden relative">

      {/* 🔥 GLOW EFFECTS */}
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-[150px] opacity-20 top-10 left-10"></div>

      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-20 bottom-10 right-10"></div>

      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-[120px] opacity-20 top-1/2 left-1/2"></div>

      <div className="absolute w-72 h-72 bg-cyan-500 rounded-full blur-[120px] opacity-20 bottom-20 left-20"></div>

      {/* 🔥 MAIN CARD */}
      <div className="relative z-10 bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.4)] rounded-[40px] overflow-hidden flex w-full max-w-6xl">

        {/* ================= LEFT SECTION ================= */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-[#2563eb] via-[#7c3aed] to-[#ec4899] text-white p-12 relative overflow-hidden">

          {/* FLOATING CIRCLES */}
          <div className="absolute w-40 h-40 bg-white/10 rounded-full top-[-40px] left-[-40px]"></div>

          <div className="absolute w-56 h-56 bg-white/10 rounded-full bottom-[-80px] right-[-60px]"></div>

          {/* LOGO */}
          <h1 className="text-6xl font-black tracking-wide mb-4 drop-shadow-lg">
            StudyNotion 🚀
          </h1>

          {/* BADGE */}
          <div className="bg-white/20 px-5 py-2 rounded-full backdrop-blur-lg mb-6 border border-white/30">

            <p className="font-semibold text-lg">
              🔐 Secure Login Portal
            </p>

          </div>

          {/* TITLE */}
          <h2 className="text-4xl font-bold text-center mt-2 leading-snug">
            Welcome Back 👋
          </h2>

          {/* DESCRIPTION */}
          <p className="text-lg text-center mt-5 leading-relaxed text-gray-100 max-w-md">
            Continue your journey, access your courses, and keep learning with StudyNotion.
          </p>

          {/* IMAGE */}
          <div className="mt-10 bg-white/10 p-5 rounded-full backdrop-blur-lg shadow-2xl hover:scale-105 transition duration-500">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="login"
              className="w-72 h-72 object-cover rounded-full border-4 border-white shadow-2xl"
            />

          </div>

          {/* FOOTER */}
          <p className="mt-8 text-sm text-white/80 tracking-wide">
            Learn • Grow • Achieve
          </p>

        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="w-full md:w-1/2 bg-white p-10 md:p-14 flex flex-col justify-center">

          {/* TITLE */}
          <div className="text-center mb-10">

            <h2 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-3">
              Login 🔐
            </h2>

            <p className="text-gray-500 text-lg">
              Access your StudyNotion account
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-300 transition text-lg shadow-sm"
              required
            />

            {/* PASSWORD */}
            <div className="relative">

              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-300 outline-none focus:ring-4 focus:ring-purple-300 transition text-lg shadow-sm"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500 font-semibold hover:text-black transition"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-4 rounded-2xl hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(168,85,247,0.5)] transition duration-300 font-bold text-xl disabled:opacity-50"
            >
              {loading
                ? 'Sending OTP...'
                : 'Send OTP 📩'}
            </button>

          </form>

          {/* SIGNUP */}
          <p className="text-center text-gray-600 mt-8 text-lg">

            Don’t have an account?{' '}

            <Link
              to="/signup"
              className="text-blue-600 font-bold hover:underline"
            >
              Signup
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;