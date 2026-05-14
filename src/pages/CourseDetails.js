import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import API from '../services/api';
import Navbar from '../components/Navbar';

function CourseDetails() {

  const { id } = useParams();

  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);

  const [enrolling, setEnrolling] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  // ================= CHECK ENROLLED =================
  const isEnrolled = () => {

    return course?.studentsEnrolled?.some(
      (student) => {

        return (
          student?._id === user?.id ||
          student === user?.id
        );
      }
    );
  };

  // ================= FETCH COURSE =================
  const fetchCourse = async () => {

    try {

      const res = await API.get(`/course/${id}`);

      setCourse(res.data.course);

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        'Failed to fetch course ❌'
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= ENROLL =================
  const enrollCourse = async () => {

    try {

      setEnrolling(true);

      await API.post('/course/enroll', {
        courseId: id,
      });

      toast.success('Enrolled successfully 🎉');

      // 🔥 REFRESH COURSE
      fetchCourse();

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        'Enrollment failed ❌'
      );

    } finally {

      setEnrolling(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  // ================= LOADING =================
  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center bg-gray-100">

        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      </div>
    );
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

      <div className="max-w-7xl mx-auto p-6">

        {/* DARK MODE BUTTON */}
        <div className="flex justify-end mb-6">

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={
              darkMode
                ? 'bg-yellow-400 text-black px-6 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 transition'
                : 'bg-black text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 transition'
            }
          >

            {darkMode
              ? '☀️ Light Mode'
              : '🌙 Dark Mode'}

          </button>

        </div>

        {/* MAIN CARD */}
        <div
          className={
            darkMode
              ? 'bg-gray-900 rounded-[35px] shadow-2xl overflow-hidden border border-gray-800'
              : 'bg-white rounded-[35px] shadow-2xl overflow-hidden'
          }
        >

          {/* IMAGE */}
          <div className="relative">

            <img
              src={
  course.image
    ? course.image
    : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
}
              alt="course"
              className="w-full h-[450px] object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* TITLE OVER IMAGE */}
            <div className="absolute bottom-10 left-10">

              <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white font-semibold inline-block mb-5">

                🚀 Premium Course

              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-4">

                {course.title}

              </h1>

              <p className="text-white/90 text-xl max-w-3xl">

                {course.description}

              </p>

            </div>

          </div>

          {/* CONTENT */}
          <div className="p-8 md:p-12">

            {/* INFO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

              {/* INSTRUCTOR */}
              <div
                className={
                  darkMode
                    ? 'bg-blue-900/20 border border-blue-800 rounded-3xl p-8 shadow-xl'
                    : 'bg-blue-50 rounded-3xl p-8 shadow-xl'
                }
              >

                <div className="text-5xl mb-4">
                  👨‍🏫
                </div>

                <h2 className="text-2xl font-black mb-3">
                  Instructor
                </h2>

                <p
                  className={
                    darkMode
                      ? 'text-gray-300 text-xl'
                      : 'text-gray-700 text-xl'
                  }
                >

                  {course.instructor?.firstName}{' '}
                  {course.instructor?.lastName}

                </p>

              </div>

              {/* PRICE */}
              <div
                className={
                  darkMode
                    ? 'bg-green-900/20 border border-green-800 rounded-3xl p-8 shadow-xl'
                    : 'bg-green-50 rounded-3xl p-8 shadow-xl'
                }
              >

                <div className="text-5xl mb-4">
                  💰
                </div>

                <h2 className="text-2xl font-black mb-3">
                  Course Price
                </h2>

                <p className="text-5xl font-black text-green-500">

                  ₹ {course.price}

                </p>

              </div>

              {/* STUDENTS */}
              <div
                className={
                  darkMode
                    ? 'bg-purple-900/20 border border-purple-800 rounded-3xl p-8 shadow-xl'
                    : 'bg-purple-50 rounded-3xl p-8 shadow-xl'
                }
              >

                <div className="text-5xl mb-4">
                  🎓
                </div>

                <h2 className="text-2xl font-black mb-3">
                  Students Enrolled
                </h2>

                <p className="text-5xl font-black text-purple-500">

                  {course.studentsEnrolled?.length || 0}

                </p>

              </div>

            </div>

            {/* DEMO VIDEO */}
            <div className="mb-14">

              <h2 className="text-4xl font-black mb-6">
                🎥 Demo Video
              </h2>

              {course.video ? (

                <div className="rounded-3xl overflow-hidden shadow-2xl">

                  <video
                    controls
                    className="w-full"
                  >

                    <source src={course.video} />

                  </video>

                </div>

              ) : (

                <div
                  className={
                    darkMode
                      ? 'bg-gray-800 border border-gray-700 rounded-3xl p-10 text-center'
                      : 'bg-gray-100 rounded-3xl p-10 text-center'
                  }
                >

                  <div className="text-7xl mb-5">
                    🎬
                  </div>

                  <h3 className="text-3xl font-black mb-3">
                    No Demo Video Available
                  </h3>

                  <p
                    className={
                      darkMode
                        ? 'text-gray-400 text-lg'
                        : 'text-gray-600 text-lg'
                    }
                  >
                    Instructor has not uploaded a demo video yet.
                  </p>

                </div>

              )}

            </div>

            {/* ENROLL BUTTON */}
            {user?.role === 'student' && (

              isEnrolled() ? (

                <button
                  disabled
                  className="w-full bg-green-500 text-white py-5 rounded-3xl text-2xl font-black shadow-2xl cursor-not-allowed"
                >
                  ✅ Already Enrolled
                </button>

              ) : (

                <button
                  onClick={enrollCourse}
                  disabled={enrolling}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-5 rounded-3xl text-2xl font-black hover:scale-[1.01] transition duration-300 shadow-2xl"
                >

                  {enrolling
                    ? 'Enrolling...'
                    : 'Enroll Now 🚀'}

                </button>

              )

            )}

            {/* EDIT BUTTON FOR INSTRUCTOR */}
            {user?.role === 'instructor' &&
             course.instructor?._id === user?.id && (

              <button
                onClick={() =>
                  window.location.href =
                    `/edit-course/${course._id}`
                }
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-5 rounded-3xl text-2xl font-black hover:scale-[1.01] transition duration-300 shadow-2xl"
              >
                ✏️ Edit Course
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default CourseDetails;