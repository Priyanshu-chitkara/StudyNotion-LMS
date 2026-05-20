const Course = require('../models/Course');
const cloudinary = require('../config/cloudinary');

// ================= CREATE COURSE =================
const createCourse = async (req, res) => {

  try {

    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("FILES:", req.files);

    const { title, description, price } = req.body;

    // VALIDATION
    if (!title || !description || !price) {

      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    let imageUrl = '';

    let videoUrl = '';

    // SMART DEFAULT IMAGE
    const getDefaultImage = () => {

      const text =
        `${title} ${description}`.toLowerCase();

      // DSA
      if (
        text.includes('dsa') ||
        text.includes('data structure') ||
        text.includes('algorithm')
      ) {

        return 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4';
      }

      // WEB DEVELOPMENT
      if (
        text.includes('web') ||
        text.includes('html') ||
        text.includes('css') ||
        text.includes('javascript')
      ) {

        return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085';
      }

      // JAVA
      if (
        text.includes('java')
      ) {

        return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97';
      }

      // PYTHON
      if (
        text.includes('python')
      ) {

        return 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935';
      }

      // ENGLISH / COMMUNICATION
      if (
        text.includes('english') ||
        text.includes('communication')
      ) {

        return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f';
      }

      // MARKETING / STOCK MARKET
      if (
        text.includes('marketing') ||
        text.includes('stock') ||
        text.includes('finance')
      ) {

        return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f';
      }

      // DEFAULT
      return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3';
    };

    // IMAGE UPLOAD
    if (req.files?.image) {

      console.log("Uploading image...");

      const imageResult =
        await cloudinary.uploader.upload(
          req.files.image[0].path
        );

      imageUrl =
        imageResult.secure_url;
    }

    // VIDEO UPLOAD
    if (req.files?.video) {

      console.log("Uploading video...");

      const videoResult =
        await cloudinary.uploader.upload(
          req.files.video[0].path,
          {
            resource_type: 'video',
          }
        );

      console.log(videoResult);

      videoUrl =
        videoResult.secure_url;
    }

    // DEFAULT IMAGE
    if (!imageUrl) {

      imageUrl = getDefaultImage();
    }

    // CREATE COURSE
    const course = await Course.create({

      title,

      description,

      price,

      image: imageUrl,

      video: videoUrl,

      instructor: req.user._id,
    });

    res.status(201).json({

      message:
        'Course created successfully 🚀',

      course,
    });

  } catch (error) {

    console.log(
      "CREATE COURSE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ALL COURSES =================
const getAllCourses = async (req, res) => {

  try {

    const courses = await Course.find({
      isDeleted: false,
    })

      .populate(
        'instructor',
        'firstName lastName email'
      )

      .populate(
        'studentsEnrolled',
        '_id firstName lastName email'
      );

    res.status(200).json({

      message:
        'Courses fetched successfully',

      courses,
    });

  } catch (error) {

    console.log(
      "GET COURSES ERROR:",
      error
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// ================= GET SINGLE COURSE =================
const getCourseById = async (req, res) => {

  try {

    const course = await Course.findOne({

      _id: req.params.courseId,

      isDeleted: false,

    })

      .populate(
        'instructor',
        'firstName lastName email'
      )

      .populate(
        'studentsEnrolled',
        'firstName lastName email'
      );

    if (!course) {

      return res.status(404).json({
        message: 'Course not found',
      });
    }

    res.status(200).json({
      course,
    });

  } catch (error) {

    console.log(
      "GET COURSE ERROR:",
      error
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// ================= ENROLL COURSE =================
const enrollCourse = async (req, res) => {

  try {

    const { courseId } = req.body;

    if (!courseId) {

      return res.status(400).json({
        message:
          'Course ID is required',
      });
    }

    const course = await Course.findOne({

      _id: courseId,

      isDeleted: false,

    });

    if (!course) {

      return res.status(404).json({
        message: 'Course not found',
      });
    }

    // ALREADY ENROLLED
    if (
      course.studentsEnrolled.includes(
        req.user._id
      )
    ) {

      return res.status(400).json({
        message:
          'Already enrolled',
      });
    }

    // ADD STUDENT
    course.studentsEnrolled.push(
      req.user._id
    );

    await course.save();

    res.status(200).json({

      message:
        'Enrolled successfully 🎉',

      course,
    });

  } catch (error) {

    console.log(
      "ENROLL ERROR:",
      error
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// ================= STUDENT COURSES =================
const getMyCourses = async (req, res) => {

  try {

    const courses = await Course.find({

      studentsEnrolled:
        req.user._id,

      isDeleted: false,

    }).populate(
      'instructor',
      'firstName lastName email'
    );

    res.status(200).json({

      message:
        'My courses fetched successfully',

      courses,
    });

  } catch (error) {

    console.log(
      "MY COURSES ERROR:",
      error
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// ================= INSTRUCTOR COURSES =================
const getInstructorCourses = async (req, res) => {

  try {

    const courses = await Course.find({

      instructor:
        req.user._id,

      isDeleted: false,

    }).populate(
      'studentsEnrolled',
      'firstName lastName email'
    );

    res.status(200).json({
      courses,
    });

  } catch (error) {

    console.log(
      "INSTRUCTOR COURSES ERROR:",
      error
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// ================= UPDATE COURSE =================
const updateCourse = async (req, res) => {

  try {

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      title,
      description,
      price,
    } = req.body;

    const course =
      await Course.findById(
        req.params.courseId
      );

    if (!course) {

      return res.status(404).json({
        message: 'Course not found',
      });
    }

    // ONLY OWNER CAN EDIT
    if (
      course.instructor.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message:
          'You can only edit your own course',
      });
    }

    // UPDATE FIELDS
    if (title) {

      course.title = title;
    }

    if (description) {

      course.description =
        description;
    }

    if (price) {

      course.price = price;
    }

    // IMAGE
    if (req.files?.image) {

      console.log(
        "Uploading new image..."
      );

      const imageResult =
        await cloudinary.uploader.upload(
          req.files.image[0].path
        );

      course.image =
        imageResult.secure_url;
    }

    // VIDEO
    if (req.files?.video) {

      console.log(
        "Uploading new video..."
      );

      const videoResult =
        await cloudinary.uploader.upload(
          req.files.video[0].path,
          {
            resource_type: 'video',
          }
        );

      console.log(videoResult);

      course.video =
        videoResult.secure_url;
    }

    await course.save();

    res.status(200).json({

      message:
        'Course updated successfully 🚀',

      course,
    });

  } catch (error) {

    console.log(
      "UPDATE COURSE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE COURSE =================
const deleteCourse = async (req, res) => {

  try {

    const { courseId } =
      req.params;

    const course =
      await Course.findById(
        courseId
      );

    if (!course) {

      return res.status(404).json({
        message: 'Course not found',
      });
    }

    // ONLY OWNER CAN DELETE
    if (
      course.instructor.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          'You can delete only your own courses',
      });
    }

    // SOFT DELETE
    course.isDeleted = true;

    course.deletedAt = new Date();

    await course.save();

    res.status(200).json({

      message:
        'Course moved to recycle bin 🗑️',

      course,
    });

  } catch (error) {

    console.log(
      "DELETE COURSE ERROR:",
      error
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// ================= RECYCLE BIN =================
const getDeletedCourses = async (req, res) => {

  try {

    // AUTO DELETE AFTER 10 DAYS
    const tenDaysAgo =
      new Date(
        Date.now() -
        10 * 24 * 60 * 60 * 1000
      );

    // DELETE OLD COURSES
    await Course.deleteMany({

      isDeleted: true,

      deletedAt: {
        $lt: tenDaysAgo,
      },

    });

    // FETCH DELETED COURSES
    const courses = await Course.find({

      instructor: req.user._id,

      isDeleted: true,

    });

    res.status(200).json({
      courses,
    });

  } catch (error) {

    console.log(
      "RECYCLE BIN ERROR:",
      error
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// ================= RESTORE COURSE =================
const restoreCourse = async (req, res) => {

  try {

    const { courseId } =
      req.params;

    const course =
      await Course.findById(
        courseId
      );

    if (!course) {

      return res.status(404).json({
        message: 'Course not found',
      });
    }

    // ONLY OWNER CAN RESTORE
    if (
      course.instructor.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          'You can restore only your own courses',
      });
    }

    // RESTORE
    course.isDeleted = false;

    course.deletedAt = null;

    await course.save();

    res.status(200).json({

      message:
        'Course restored successfully ♻️',

      course,
    });

  } catch (error) {

    console.log(
      "RESTORE ERROR:",
      error
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
};

// ================= EXPORT =================
module.exports = {

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
};