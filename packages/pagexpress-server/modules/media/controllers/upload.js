const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const s3 = require('../tools/s3');

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|svg|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../../../', 'static/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const awsStorage = multerS3({
  s3,
  // bucket: process.env.BUCKET_NAME,
  bucket: 'pagexpress-dev/media/',
  key: function (req, file, cb) {
    cb(null, Date.now().toString());
  },
});

const upload = multer({
  storage: process.env.AWS_BUCKET_NAME ? awsStorage() : fileStorage,
  limits: { fileSize: 8000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.export = upload;
