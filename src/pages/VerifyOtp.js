import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import API from '../services/api';

function VerifyOtp() {

  const [otp, setOtp] = useState('');

  // 🔥 TIMER
  const [timer, setTimer] = useState(30);

  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ USE LOCAL STORAGE
  const userId = localStorage.getItem('userId');

  const email = localStorage.getItem('email');

  // ================= TIMER =================
  useEffect(() => {

    if (timer === 0) return;

    const interval = setInterval(() => {

      setTimer((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  // ================= VERIFY OTP =================
  const handleVerify = async () => {

    try {

      // 🔥 DEBUG
      console.log('USER ID:', userId);
      console.log('OTP:', otp);

      const res = await API.post(
        '/auth/verify-otp',
        {
          userId,
          otp,
        }
      );

      // ✅ STORE TOKEN
      localStorage.setItem(
        'token',
        res.data.token
      );

      // ✅ STORE USER
      localStorage.setItem(
        'user',
        JSON.stringify(res.data.user)
      );

      toast.success('Login successful 🎉');

      // 🔥 REDIRECT
      setTimeout(() => {

        navigate('/courses');

      }, 1200);

    } catch (err) {

      console.log(err);

      toast.error(
        err?.response?.data?.message ||
        'Invalid OTP ❌'
      );
    }
  };

  // ================= RESEND OTP =================
  const handleResendOtp = async () => {

    try {

      setResendLoading(true);

      // 🔥 SHOW MESSAGE
      toast.success(
        'Generate new OTP by logging in again 🔁'
      );

      // 🔥 REDIRECT
      setTimeout(() => {

        navigate('/');

      }, 1500);

    } catch (err) {

      toast.error(
        'Something went wrong ❌'
      );

    } finally {

      setResendLoading(false);
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
      <div className="relative z-10 bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.4)] rounded-[40px] overflow-hidden w-full max-w-md">

        <div className="bg-white p-10">

          {/* 🔐 ICON */}
          <div className="flex justify-center mb-5">

            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-5 rounded-full shadow-xl">

              <span className="text-4xl">
                🔐
              </span>

            </div>

          </div>

          {/* TITLE */}
          <h2 className="text-4xl font-black text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-3">
            Verify OTP
          </h2>

          {/* DESCRIPTION */}
          <p className="text-center text-gray-500 text-lg mb-8">
            Enter the OTP sent to your account
          </p>

          {/* OTP INPUT */}
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            className="w-full border border-gray-300 p-4 rounded-2xl mb-5 outline-none focus:ring-4 focus:ring-purple-300 text-lg shadow-sm"
          />

          {/* TIMER */}
          <div className="text-center mb-6">

            {timer > 0 ? (

              <p className="text-gray-600 font-medium text-lg">

                ⏳ Resend OTP in{' '}

                <span className="text-red-500 font-bold">
                  {timer}s
                </span>

              </p>

            ) : (

              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-blue-600 font-bold hover:underline text-lg"
              >
                {resendLoading
                  ? 'Redirecting...'
                  : 'Resend OTP'}
              </button>

            )}

          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-4 rounded-2xl hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(168,85,247,0.5)] transition duration-300 font-bold text-xl"
          >
            Verify OTP 🚀
          </button>

        </div>

      </div>

    </div>
  );
}

export default VerifyOtp;