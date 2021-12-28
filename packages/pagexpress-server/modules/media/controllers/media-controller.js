const { Media } = require('../models/Media');
const { s3 } = require('../tools');
const { BadRequest } = require('../../../utils/errors');
const { uploadFileToS3 } = require('./upload');
const ListFeatures = require('../../../utils/ListFeatures');

class MediaController {
  constructor(moduleConfig) {
    this.config = moduleConfig;
  }

  async getImage(req, res, next) {
    const { mediaId } = req.params;

    try {
      const media = await Media.findById(mediaId);

      if (!media) {
        return next(new BadRequest('Media object not exists'));
      }

      const imageStream = s3
        .getObject({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: media.key,
        })
        .createReadStream();

      if (!imageStream) {
        return next(new BadRequest('Image is not available'));
      }

      imageStream.pipe(res);
    } catch (err) {
      next(err);
    }
  }

  async getMedia(req, res, next) {
    const { mediaId } = req.params;

    try {
      if (mediaId) {
        const media = await Media.findById(mediaId);
        res.json(media);

        return;
      }

      const sortableFields = ['name', 'mimetype', 'createdAt', 'updatedAt'];
      const listFeatures = new ListFeatures(Media, req.query, 'name');
      const { currentPage, itemsPerPage, limit, skip, totalPages } =
        await listFeatures.getPaginationParameters();
      const sortBy = listFeatures.getSort(sortableFields);
      const queryFilter = listFeatures.getQueryFilter();

      const data = await Media.find(queryFilter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .exec();

      res.json({
        currentPage,
        data,
        itemsPerPage,
        totalPages,
      });
    } catch (err) {
      next(err);
    }
  }

  async uploadImages(req, res, next) {
    const { files } = req;

    try {
      const filesData = await Promise.all(files.map(uploadFileToS3));
      const mediaObjects = await Promise.all(
        filesData.map(singleFileData => {
          const media = new Media(singleFileData);
          media.url = `/v1/media/image/${media._id}`;
          return media.save();
        })
      );
      res.json(mediaObjects);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MediaController;
