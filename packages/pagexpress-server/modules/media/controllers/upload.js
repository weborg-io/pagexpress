const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { imageDimensions, s3 } = require('../tools');

const getFileName = () =>
  `${process.env.AWS_ROOT_FOLDER}/${Date.now().toString()}`;
const tempUploadFolder = path.resolve(__dirname, '../../../', 'tmp/uploads');

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
    cb(null, tempUploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadTemp = multer({
  storage: fileStorage,
  limits: { fileSize: 8000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const getS3Params = file => {
  const fileStream = fs.createReadStream(file.path);

  return {
    ContentType: file.mimetype,
    Bucket: process.env.AWS_S3_BUCKET,
    Key: getFileName(),
    Body: fileStream,
  };
};

/**
 * @param file
 * @returns {Promise<object>}
 */
const uploadFileToS3 = async file => {
  const uploadParams = getS3Params(file);

  try {
    await s3
      .upload(uploadParams, err => {
        if (err) {
          throw new Error(err);
        }
      })
      .promise();

    const { width, height } = await imageDimensions(file.path);
    fs.unlink(file.path, err => {
      if (err) {
        console.log(err);
      }
    });

    return {
      name: file.originalname,
      mimetype: file.mimetype,
      width,
      height,
      size: file.size,
      key: uploadParams.Key,
    };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  getFileName,
  tempUploadFolder,
  uploadFileToS3,
  uploadTemp,
};
