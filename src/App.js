import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CourseDetails from './pages/CourseDetails';

// Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import CreateCourse from './pages/CreateCourse';
import VerifyOtp from './pages/VerifyOtp';

// Protected
import ProtectedRoute from './components/ProtectedRoute';
import InstructorDashboard from './pages/InstructorDashboard';
import EditCourse from './pages/EditCourse';

function App() {
  return (
    <BrowserRouter>

      {/* 🔥 Toast Container */}
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

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
  path="/course/:id"
  element={
    <ProtectedRoute>
      <CourseDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/edit-course/:id"
  element={
    <ProtectedRoute>
      <EditCourse />
    </ProtectedRoute>
  }
/>

        <Route
          path="/create-course"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
  path="/instructor-dashboard"
  element={
    <ProtectedRoute>
      <InstructorDashboard />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;