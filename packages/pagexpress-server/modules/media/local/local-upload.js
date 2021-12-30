const { unlink } = require('fs').promises;
const multer = require('multer');
const path = require('path');

const isFileImageType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|svg|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

const removeTempFile = tempFilePath => unlink(tempFilePath);

const localUpload = destination => {
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, destination),
    filename: (req, file, cb) => cb(null, file.originalname),
  });

  return multer({
    storage: fileStorage,
    limits: { fileSize: 8000000 },
    fileFilter: (req, file, cb) => {
      isFileImageType(file, cb);
    },
  });
};

module.exports = {
  localUpload,
  removeTempFile,
};
