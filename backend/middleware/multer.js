const multer = require('multer');

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + '-' + file.originalname
    );
  },
});

const upload = multer({

  storage,

  // 🔥 FILE SIZE LIMIT
  limits: {

    // 100 MB
    fileSize: 100 * 1024 * 1024,
  },
});

module.exports = upload;