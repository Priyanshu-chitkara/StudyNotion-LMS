import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import API from '../services/api';
import Navbar from '../components/Navbar';

function InstructorDashboard() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {

    try {

      const res = await API.get(
        '/course/instructor-courses'
      );

      setCourses(res.data.courses);

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        'Failed to fetch instructor courses ❌'
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= DELETE COURSE =================
  const deleteCourse = async (id) => {

    try {

      await API.delete(
        `/course/delete/${id}`
      );

      toast.success(
        'Course deleted successfully 🗑️'
      );

      fetchCourses();

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        'Delete failed ❌'
      );
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-10">

          <div>

            <h2 className="text-5xl font-black mb-3">

              👨‍🏫 Instructor Dashboard

            </h2>

            <p
              className={
                darkMode
                  ? 'text-gray-400 text-lg'
                  : 'text-gray-600 text-lg'
              }
            >

              Manage your courses, students,
              videos & analytics 🚀

            </p>

          </div>

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

        {/* LOADING */}
        {loading ? (

          <div className="flex justify-center items-center h-40">

            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : courses.length === 0 ? (

          <div
            className={
              darkMode
                ? 'bg-gray-900 p-10 rounded-3xl shadow-xl text-center'
                : 'bg-white p-10 rounded-3xl shadow-xl text-center'
            }
          >

            <div className="text-7xl mb-5">
              📚
            </div>

            <p
              className={
                darkMode
                  ? 'text-2xl font-bold text-gray-300'
                  : 'text-2xl font-bold text-gray-600'
              }
            >

              No courses created yet 😔

            </p>

          </div>

        ) : (

          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

            {courses.map((course) => (

              <div
                key={course._id}
                className={
                  darkMode
                    ? 'bg-gray-900 rounded-[30px] shadow-xl overflow-hidden border border-gray-800 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-900'
                    : 'bg-white rounded-[30px] shadow-xl overflow-hidden border border-gray-100 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-blue-50 hover:via-purple-50 hover:to-pink-50'
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
                    className="w-full h-[300px] object-cover"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                  {/* PRICE */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">

                    ₹ {course.price}

                  </div>

                </div>

                {/* CONTENT */}
                <div className="p-6">

                  {/* TITLE */}
                  <h3
                    className={
                      darkMode
                        ? 'text-3xl font-black mb-3 text-white'
                        : 'text-3xl font-black mb-3 text-gray-800'
                    }
                  >

                    {course.title}

                  </h3>

                  {/* DESCRIPTION */}
                  <p
                    className={
                      darkMode
                        ? 'text-gray-300 mb-5 line-clamp-3 leading-relaxed'
                        : 'text-gray-600 mb-5 line-clamp-3 leading-relaxed'
                    }
                  >

                    {course.description}

                  </p>

                  {/* STUDENTS */}
                  <div
                    className={
                      darkMode
                        ? 'bg-purple-900/30 rounded-2xl p-4 mb-5'
                        : 'bg-purple-50 rounded-2xl p-4 mb-5'
                    }
                  >

                    <p className="text-lg font-bold text-purple-400">

                      👨‍🎓 Students Enrolled:
                      {' '}
                      {course.studentsEnrolled?.length || 0}

                    </p>

                  </div>

                  {/* ACTIVE STUDENTS */}
                  <div className="mb-6">

                    <p className="font-bold text-lg mb-3">

                      Active Students 👇

                    </p>

                    {course.studentsEnrolled?.length > 0 ? (

                      <div className="space-y-3 max-h-44 overflow-y-auto pr-2">

                        {course.studentsEnrolled.map((student) => (

                          <div
                            key={student._id}
                            className={
                              darkMode
                                ? 'bg-gray-800 p-3 rounded-2xl'
                                : 'bg-gray-100 p-3 rounded-2xl'
                            }
                          >

                            <p
                              className={
                                darkMode
                                  ? 'font-semibold text-white'
                                  : 'font-semibold text-gray-800'
                              }
                            >

                              {student.firstName}
                              {' '}
                              {student.lastName}

                            </p>

                            <p
                              className={
                                darkMode
                                  ? 'text-sm text-gray-400'
                                  : 'text-sm text-gray-500'
                              }
                            >

                              {student.email}

                            </p>

                          </div>

                        ))}

                      </div>

                    ) : (

                      <div
                        className={
                          darkMode
                            ? 'bg-gray-800 rounded-2xl p-4 text-center'
                            : 'bg-gray-100 rounded-2xl p-4 text-center'
                        }
                      >

                        <p
                          className={
                            darkMode
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }
                        >

                          No students enrolled yet

                        </p>

                      </div>

                    )}

                  </div>

                  {/* VIDEO */}
                  <div className="mb-6">

                    <h4 className="font-bold text-lg mb-3">

                      🎥 Demo Video

                    </h4>

                    {course.video ? (

                      <video
                        controls
                        className="w-full rounded-2xl shadow-lg"
                      >

                        <source src={course.video} />

                      </video>

                    ) : (

                      <div
                        className={
                          darkMode
                            ? 'bg-gray-800 rounded-2xl p-6 text-center'
                            : 'bg-gray-100 rounded-2xl p-6 text-center'
                        }
                      >

                        <div className="text-5xl mb-3">
                          🎬
                        </div>

                        <p
                          className={
                            darkMode
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }
                        >

                          No demo video uploaded

                        </p>

                      </div>

                    )}

                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-4">

                    {/* EDIT */}
                    <button
                      onClick={() =>
                        navigate(
                          `/edit-course/${course._id}`
                        )
                      }
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-2xl font-bold hover:scale-[1.02] transition duration-300 shadow-lg"
                    >

                      ✏️ Edit

                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        deleteCourse(course._id)
                      }
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-2xl font-bold hover:scale-[1.02] transition duration-300 shadow-lg"
                    >

                      🗑️ Delete

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default InstructorDashboard;