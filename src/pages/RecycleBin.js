import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';

import API from '../services/api';

import Navbar from '../components/Navbar';

function RecycleBin() {

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  // ================= FETCH DELETED COURSES =================
  const fetchDeletedCourses =
    async () => {

      try {

        const res =
          await API.get(
            '/course/recycle-bin'
          );

        setCourses(
          res.data.courses
        );

      } catch (error) {

        toast.error(
          'Failed to fetch recycle bin ❌'
        );

      } finally {

        setLoading(false);
      }
    };

  // ================= RESTORE COURSE =================
  const restoreCourse =
    async (courseId) => {

      try {

        await API.put(
          `/course/restore/${courseId}`
        );

        toast.success(
          'Course restored successfully ♻️'
        );

        fetchDeletedCourses();

      } catch (error) {

        toast.error(
          'Restore failed ❌'
        );
      }
    };

  useEffect(() => {

    fetchDeletedCourses();

  }, []);

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-black text-white">

      <Navbar />

      <div className="p-6">

        {/* TOP */}
        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-5xl font-black mb-3">

              ♻️ Recycle Bin

            </h1>

            <p className="text-gray-400 text-lg">

              Restore deleted courses within 10 days

            </p>

          </div>

          {/* BACK BUTTON */}
          <button
            onClick={() =>
              navigate(
                '/instructor-dashboard'
              )
            }
            className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition"
          >

            ← Back

          </button>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="flex justify-center items-center h-40">

            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : courses.length === 0 ? (

          <div className="bg-gray-900 p-10 rounded-3xl shadow-xl text-center">

            <div className="text-7xl mb-5">

              🗑️

            </div>

            <p className="text-2xl font-bold text-gray-300">

              Recycle bin is empty

            </p>

          </div>

        ) : (

          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

            {courses.map((course) => {

              // DAYS LEFT
              const deletedDate =
                new Date(
                  course.deletedAt
                );

              const currentDate =
                new Date();

              const diffTime =
                currentDate -
                deletedDate;

              const daysPassed =
                Math.floor(
                  diffTime /
                  (1000 * 60 * 60 * 24)
                );

              const daysLeft =
                10 - daysPassed;

              return (

                <div
                  key={course._id}
                  className="bg-gray-900 rounded-[30px] shadow-xl overflow-hidden border border-gray-800 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500"
                >

                  {/* IMAGE */}
                  <img
                    src={course.image}
                    alt="course"
                    className="w-full h-[250px] object-cover"
                  />

                  {/* CONTENT */}
                  <div className="p-6">

                    {/* TITLE */}
                    <h2 className="text-3xl font-black mb-3">

                      {course.title}

                    </h2>

                    {/* DESCRIPTION */}
                    <p className="text-gray-400 mb-5 line-clamp-3">

                      {course.description}

                    </p>

                    {/* DAYS LEFT */}
                    <div className="bg-red-500/20 border border-red-500 rounded-2xl p-4 mb-6">

                      <p className="text-red-400 font-bold text-lg">

                        ⏳
                        {' '}
                        {daysLeft}
                        {' '}
                        days left before permanent deletion

                      </p>

                    </div>

                    {/* RESTORE BUTTON */}
                    <button
                      onClick={() =>
                        restoreCourse(
                          course._id
                        )
                      }
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 py-3 rounded-2xl font-bold hover:scale-[1.02] transition"
                    >

                      ♻️ Restore Course

                    </button>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default RecycleBin;