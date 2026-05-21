const express = require('express');

const router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage });

const {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollCourse,
  getMyCourses,
  getInstructorCourses,
  updateCourse,
  deleteCourse,
  getDeletedCourses,
  restoreCourse,
} = require('../controllers/courseController');

const auth = require('../middleware/authMiddleware');

// ================= CREATE COURSE =================
router.post(
  '/create',
  auth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  createCourse
);

// ================= GET ALL COURSES =================
router.get('/', getAllCourses);

// SUPPORT OLD FRONTEND ROUTE
router.get('/all', getAllCourses);

// ================= MY COURSES =================
router.get(
  '/my-courses',
  auth,
  getMyCourses
);

// ================= INSTRUCTOR COURSES =================
router.get(
  '/instructor-courses',
  auth,
  getInstructorCourses
);

// ================= RECYCLE BIN =================
router.get(
  '/deleted',
  auth,
  getDeletedCourses
);

// ================= SINGLE COURSE =================
router.get(
  '/:courseId',
  getCourseById
);

// ================= ENROLL =================
router.post(
  '/enroll',
  auth,
  enrollCourse
);

// ================= UPDATE COURSE =================
router.put(
  '/update/:courseId',
  auth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  updateCourse
);

// ================= RESTORE COURSE =================
router.put(
  '/restore/:courseId',
  auth,
  restoreCourse
);

// ================= DELETE COURSE =================
router.delete(
  '/delete/:courseId',
  auth,
  deleteCourse
);

module.exports = router;