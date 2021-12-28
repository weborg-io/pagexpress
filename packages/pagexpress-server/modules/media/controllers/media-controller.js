const { Media } = require('../models/Media');
const { removeTempFile } = require('./local-upload');
const { BadRequest } = require('../../../utils/errors');
const { S3Connector, s3CommonUtils, s3 } = require('../s3');
const { image } = require('../tools');
const ListFeatures = require('../../../utils/ListFeatures');

class MediaController {
  constructor(moduleConfig, pxConfig) {
    this.mediaConfig = moduleConfig;
    this.appConfig = pxConfig;
    this.utils = s3CommonUtils(moduleConfig);
    this.s3Connector = new S3Connector(moduleConfig);
    this.getImage = this.getImage.bind(this);
    this.getMedia = this.getMedia.bind(this);
    this.uploadImages = this.uploadImages.bind(this);
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

  getImageUrl(mediaId) {
    const { apiBaseUrl } = this.appConfig;
    const { mediaApiBasePath, routes } = this.mediaConfig;
    const imageEndpoint = routes.getImage.split(':').shift();

    return `${apiBaseUrl}${mediaApiBasePath}${imageEndpoint}${mediaId}`;
  }

  async uploadImages(req, res, next) {
    const { files } = req;

    try {
      const mediaObjects = await Promise.all(
        files.map(file => {
          const media = new Media({
            name: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          });
          const targetKey = this.utils.getMediaKey(media._id);

          return this.s3Connector
            .upload(media._id, file, targetKey)
            .then(() => image.getMetadata(file.path))
            .then(({ width, height }) => {
              media.url = this.getImageUrl(media._id);
              media.key = targetKey;
              media.width = width;
              media.height = height;

              return media.save();
            });
        })
      );

      res.json(mediaObjects);
      files.forEach(file => removeTempFile(file.path));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MediaController;
