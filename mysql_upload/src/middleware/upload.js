// initializes multer storage engine and defines middleware function

// create middleware for uploading and storing image

// import multer module
const multer = require("multer");

// define a filter to only allow images to pass
const imageFilter = (req, file, cb) => {
  if(file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

// configure multer to use disk storage engine
var storage = multer.diskStorage({
  destination: (req, file, cb) => { // determines folder to store files
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => { // determines name of file in destination
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`); // duplicate prevention
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;