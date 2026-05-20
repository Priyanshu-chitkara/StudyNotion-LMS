import { Link, useNavigate } from 'react-router-dom';
import logo from '../assests/StudyNotion.png';

function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (

    <div className="bg-gray-900 text-white shadow-lg">

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">

        {/* 🔥 LOGO */}
        <div
          onClick={() => navigate('/courses')}
          className="cursor-pointer"
        >
          <h1 className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition duration-300">
            <div className="flex items-center gap-3">

  <img
    src={logo}
    alt="logo"
    className="w-12 h-12 object-contain"
  />

  <div>

    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
      StudyNotion
    </h1>
     <p className="text-sm text-gray-400">
            Learn • Grow • Achieve
          </p>

   
  </div>

</div>
          </h1>

         
        </div>

        {/* 🔥 NAVIGATION */}
        <div className="flex flex-wrap justify-center items-center gap-4">

          {/* COURSES */}
          <Link
            to="/courses"
            className="hover:text-blue-400 transition duration-300 font-medium"
          >
            📚 Courses
          </Link>

          {/* STUDENT ONLY */}
          {user?.role === 'student' && (

            <Link
              to="/my-courses"
              className="hover:text-blue-400 transition duration-300 font-medium"
            >
              🎓 My Courses
            </Link>

          )}

          {/* INSTRUCTOR ONLY */}
          {user?.role === 'instructor' && (

            <>
              {/* CREATE COURSE */}
              <Link
                to="/create-course"
                className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 font-medium"
              >
                ➕ Create Course
              </Link>

              {/* DASHBOARD */}
              <Link
                to="/instructor-dashboard"
                className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 font-medium"
              >
                👨‍🏫 Dashboard
              </Link>
            </>

          )}

          {/* USER ROLE */}
          <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">

           <p className="font-bold capitalize text-yellow-400 text-lg">
  👤 {user?.role}
</p>

          </div>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 font-medium"
          >
            🚪 Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Navbar;