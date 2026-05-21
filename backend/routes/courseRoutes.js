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

router.post(
  '/create',
  auth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  createCourse
);

router.get('/', getAllCourses);

router.get('/my-courses', auth, getMyCourses);

router.get('/instructor-courses', auth, getInstructorCourses);

router.get('/deleted', auth, getDeletedCourses);

router.get('/:courseId', getCourseById);

router.post('/enroll', auth, enrollCourse);

router.put(
  '/update/:courseId',
  auth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  updateCourse
);

router.put('/restore/:courseId', auth, restoreCourse);

router.delete('/delete/:courseId', auth, deleteCourse);

module.exports = router;