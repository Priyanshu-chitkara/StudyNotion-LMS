import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import API from '../services/api';
import Navbar from '../components/Navbar';

function MyCourses() {

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  // ================= FETCH =================
  const fetchMyCourses = async () => {

    try {

      const res = await API.get('/course/my-courses');

      setCourses(res.data.courses);

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        'Failed to fetch courses ❌'
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  // ================= GREETING =================
  const currentHour = new Date().getHours();

  let greeting = 'Good Evening';
  let emoji = '🌙';

  if (currentHour < 12) {

    greeting = 'Good Morning';
    emoji = '☀️';

  } else if (currentHour < 18) {

    greeting = 'Good Afternoon';
    emoji = '🌤️';
  }

  // ================= UI =================
  return (

    <div
      className={
        darkMode
          ? 'min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-black text-white transition duration-300'
          : 'min-h-screen bg-gradient-to-br from-gray-100 via-white to-purple-50 text-black transition duration-300'
      }
    >

      <Navbar />

      <div className="p-6">

        {/* ================= HERO ================= */}
        <div
          className={`relative overflow-hidden rounded-[35px] p-8 md:p-10 mb-12 shadow-2xl border
          ${
            darkMode
              ? 'bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#312e81] border-white/10'
              : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border-white'
          }`}
        >

          {/* GLOW */}
          <div className="absolute top-[-40px] right-[-40px] w-52 h-52 bg-pink-500 opacity-20 blur-[100px] rounded-full"></div>

          <div className="absolute bottom-[-40px] left-[-40px] w-52 h-52 bg-blue-500 opacity-20 blur-[100px] rounded-full"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* LEFT */}
            <div className="flex-1">

              <div
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-sm font-semibold shadow-lg
                ${
                  darkMode
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-white text-gray-700'
                }`}
              >
                🎓 My Learning Dashboard
              </div>

              <h1
                className={`text-5xl md:text-6xl font-black leading-tight mb-5
                ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >

                {greeting} {emoji}

                <br />

                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {user?.firstName} 👋
                </span>

              </h1>

              <p
                className={`text-lg md:text-xl leading-relaxed max-w-2xl
                ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >

                Continue your learning journey and complete your enrolled courses 🚀

              </p>

            </div>

            {/* RIGHT IMAGE */}
            <div className="flex-1 flex justify-center">

              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                alt="student"
                className="w-72 md:w-96 drop-shadow-2xl hover:scale-105 transition duration-500"
              />

            </div>

          </div>

        </div>

        {/* ================= TOP BAR ================= */}
        <div className="flex justify-between items-center mb-10">

          <h1 className="text-4xl font-black">
            My Courses 📚
          </h1>

          {/* DARK MODE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={
              darkMode
                ? 'bg-yellow-400 text-black px-6 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 transition'
                : 'bg-black text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 transition'
            }
          >

            {darkMode
              ? '☀️ Light'
              : '🌙 Dark'}

          </button>

        </div>

        {/* ================= LOADING ================= */}
        {loading ? (

          <div className="flex justify-center items-center h-40">

            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : courses.length === 0 ? (

          <div
            className={
              darkMode
                ? 'bg-gray-900 rounded-3xl p-10 text-center shadow-xl'
                : 'bg-white rounded-3xl p-10 text-center shadow-xl'
            }
          >

            <h2 className="text-3xl font-bold mb-4">
              No Courses Yet 😔
            </h2>

            <p
              className={
                darkMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }
            >
              Start enrolling in amazing courses 🚀
            </p>

          </div>

        ) : (

          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

            {courses.map((course) => (

              <div
                key={course._id}
                onClick={() =>
                  navigate(`/course/${course._id}`)
                }
               className={
  darkMode
    ? 'bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-800 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-900'
    : 'bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-blue-50 hover:via-purple-50 hover:to-pink-50'
}
              >

                {/* IMAGE */}
               <img
              src={
  course.image
    ? course.image
    : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
}
              alt="course"
              className="w-full h-[450px] object-cover"
            />


                {/* CONTENT */}
                <div className="p-6">

                  {/* TITLE */}
                  <h2 className="text-3xl font-bold mb-3">
                    {course.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p
                    className={
                      darkMode
                        ? 'text-gray-300 mb-5 line-clamp-3'
                        : 'text-gray-600 mb-5 line-clamp-3'
                    }
                  >
                    {course.description}
                  </p>

                  {/* INSTRUCTOR */}
                  <p
                    className={
                      darkMode
                        ? 'text-gray-400 mb-4'
                        : 'text-gray-500 mb-4'
                    }
                  >
                    👨‍🏫 Instructor:{' '}
                    <span className="font-semibold">
                      {course.instructor?.firstName}{' '}
                      {course.instructor?.lastName}
                    </span>
                  </p>

                  {/* PRICE */}
                  <p className="text-3xl font-extrabold text-green-500 mb-5">
                    ₹ {course.price}
                  </p>

                  {/* BUTTON */}
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-4 rounded-2xl hover:scale-[1.02] transition duration-300 font-bold text-lg"
                  >
                    Continue Learning 🚀
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyCourses;