const Course = require('../models/Course');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// ================= CLOUDINARY BUFFER HELPER =================
const uploadFromBuffer = (
  buffer,
  resourceType = 'image'
) => {

  return new Promise((resolve, reject) => {

    const stream =
      cloudinary.uploader.upload_stream(

        {
          resource_type: resourceType,
          folder: 'StudyNotion/Courses',
        },

        (error, result) => {

          if (error) {

            reject(error);

          } else {

            resolve(result);
          }
        }
      );

    streamifier
      .createReadStream(buffer)
      .pipe(stream);
  });
};

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

    // DEFAULT IMAGE FUNCTION
    const getDefaultImage = () => {

      const text =
        `${title} ${description}`.toLowerCase();

      if (
        text.includes('dsa') ||
        text.includes('algorithm')
      ) {

        return 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4';
      }

      if (
        text.includes('web') ||
        text.includes('javascript')
      ) {

        return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085';
      }

      if (
        text.includes('java')
      ) {

        return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97';
      }

      if (
        text.includes('python')
      ) {

        return 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935';
      }

      return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3';
    };

    // ================= IMAGE UPLOAD =================
    if (req.files?.image) {

      console.log("Uploading image...");

      const imageResult =
        await uploadFromBuffer(
          req.files.image[0].buffer,
          'image'
        );

      imageUrl =
        imageResult.secure_url;

      console.log("IMAGE URL:", imageUrl);
    }

    // ================= VIDEO UPLOAD =================
    if (req.files?.video) {

      console.log("Uploading video...");

      const videoResult =
        await uploadFromBuffer(
          req.files.video[0].buffer,
          'video'
        );

      videoUrl =
        videoResult.secure_url;

      console.log("VIDEO URL:", videoUrl);
    }

    // ================= DEFAULT IMAGE =================
    if (!imageUrl) {

      imageUrl = getDefaultImage();
    }

    // ================= CREATE COURSE =================
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

    if (
      course.instructor.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message:
          'You can only edit your own course',
      });
    }

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

    // IMAGE UPDATE
    if (req.files?.image) {

      const imageResult =
        await uploadFromBuffer(
          req.files.image[0].buffer,
          'image'
        );

      course.image =
        imageResult.secure_url;
    }

    // VIDEO UPDATE
    if (req.files?.video) {

      const videoResult =
        await uploadFromBuffer(
          req.files.video[0].buffer,
          'video'
        );

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

    if (
      course.instructor.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          'You can delete only your own courses',
      });
    }

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

    const tenDaysAgo =
      new Date(
        Date.now() -
        10 * 24 * 60 * 60 * 1000
      );

    await Course.deleteMany({

      isDeleted: true,

      deletedAt: {
        $lt: tenDaysAgo,
      },

    });

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

    if (
      course.instructor.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          'You can restore only your own courses',
      });
    }

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