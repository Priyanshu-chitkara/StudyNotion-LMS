import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import CourseDetails from './pages/CourseDetails';

// TOAST
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// PAGES
import Login from './pages/Login';

import Signup from './pages/Signup';

import Courses from './pages/Courses';

import MyCourses from './pages/MyCourses';

import CreateCourse from './pages/CreateCourse';

import VerifyOtp from './pages/VerifyOtp';

import InstructorDashboard from './pages/InstructorDashboard';

import EditCourse from './pages/EditCourse';

import RecycleBin from './pages/RecycleBin';

// PROTECTED ROUTE
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (

    <BrowserRouter>

      {/* TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="dark"
      />

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* OTP */}
        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        {/* COURSES */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute>

              <Courses />

            </ProtectedRoute>
          }
        />

        {/* MY COURSES */}
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>

              <MyCourses />

            </ProtectedRoute>
          }
        />

        {/* COURSE DETAILS */}
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>

              <CourseDetails />

            </ProtectedRoute>
          }
        />

        {/* CREATE COURSE */}
        <Route
          path="/create-course"
          element={
            <ProtectedRoute>

              <CreateCourse />

            </ProtectedRoute>
          }
        />

        {/* EDIT COURSE */}
        <Route
          path="/edit-course/:id"
          element={
            <ProtectedRoute>

              <EditCourse />

            </ProtectedRoute>
          }
        />

        {/* INSTRUCTOR DASHBOARD */}
        <Route
          path="/instructor-dashboard"
          element={
            <ProtectedRoute>

              <InstructorDashboard />

            </ProtectedRoute>
          }
        />

        {/* RECYCLE BIN */}
        <Route
          path="/recycle-bin"
          element={
            <ProtectedRoute>

              <RecycleBin />

            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;