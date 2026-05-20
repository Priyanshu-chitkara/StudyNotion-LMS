const express = require('express');

const router = express.Router();

const authMiddleware =
  require('../middleware/authMiddleware');

const {
  authorizeRoles,
} = require('../middleware/roleMiddleware');

// MULTER
const upload =
  require('../middleware/multer');

// CONTROLLERS
const {

  createCourse,

  getAllCourses,

  enrollCourse,

  getMyCourses,

  getInstructorCourses,

  getCourseById,

  updateCourse,

  deleteCourse,

  // RECYCLE BIN
  getDeletedCourses,

  restoreCourse,

} = require('../controllers/courseController');


// ================= CREATE COURSE =================
router.post(

  '/create',

  authMiddleware,

  authorizeRoles('instructor'),

  upload.fields([

    {
      name: 'image',
      maxCount: 1,
    },

    {
      name: 'video',
      maxCount: 1,
    },

  ]),

  createCourse
);


// ================= GET ALL COURSES =================
router.get(

  '/all',

  authMiddleware,

  getAllCourses
);


// ================= ENROLL COURSE =================
router.post(

  '/enroll',

  authMiddleware,

  authorizeRoles('student'),

  enrollCourse
);


// ================= STUDENT DASHBOARD =================
router.get(

  '/my-courses',

  authMiddleware,

  authorizeRoles('student'),

  getMyCourses
);


// ================= INSTRUCTOR DASHBOARD =================
router.get(

  '/instructor-courses',

  authMiddleware,

  authorizeRoles('instructor'),

  getInstructorCourses
);


// ================= UPDATE COURSE =================
router.put(

  '/update/:courseId',

  authMiddleware,

  authorizeRoles('instructor'),

  upload.fields([

    {
      name: 'image',
      maxCount: 1,
    },

    {
      name: 'video',
      maxCount: 1,
    },

  ]),

  updateCourse
);


// ================= DELETE COURSE =================
router.delete(

  '/delete/:courseId',

  authMiddleware,

  authorizeRoles('instructor'),

  deleteCourse
);


// ================= RECYCLE BIN =================
router.get(

  '/recycle-bin',

  authMiddleware,

  authorizeRoles('instructor'),

  getDeletedCourses
);


// ================= RESTORE COURSE =================
router.put(

  '/restore/:courseId',

  authMiddleware,

  authorizeRoles('instructor'),

  restoreCourse
);


// ================= GET SINGLE COURSE =================
router.get(

  '/:courseId',

  authMiddleware,

  getCourseById
);


module.exports = router;