const path = require('path');
const { Media, updateMediaValidationSchema } = require('../models/Media');
const { removeTempFile } = require('../local/local-upload');
const { BadRequest, NotFound } = require('../../../utils/errors');
const { S3Connector, s3CommonUtils } = require('../s3');
const { image } = require('../tools');
const ListFeatures = require('../../../utils/ListFeatures');
const { enrichMediaItem } = require('../tools/image');

class MediaController {
  constructor(moduleConfig, pxConfig) {
    this.mediaConfig = moduleConfig;
    this.appConfig = pxConfig;
    this.utils = s3CommonUtils(moduleConfig);
    this.s3Connector = new S3Connector(moduleConfig);
    this.getImage = this.getImage.bind(this);
    this.getMedia = this.getMedia.bind(this);
    this.uploadImages = this.uploadImages.bind(this);
    this.uploadSingleImage = this.uploadSingleImage.bind(this);
    this.updateMedia = this.updateMedia.bind(this);
    this.deleteMedia = this.deleteMedia.bind(this);
  }

  async getImage(req, res, next) {
    const { mediaId } = req.params;

    try {
      const media = await Media.findById(mediaId);

      if (!media) {
        next(new BadRequest('Media object not exists'));

        return;
      }
      const targetKey = this.utils.getMediaKey(mediaId, req.query);
      let image;

      if (media.versionKeys.includes(targetKey)) {
        image = await this.s3Connector.getObjectIfExists({
          Bucket: this.mediaConfig.aws.s3Bucket,
          Key: targetKey,
        });
      } else {
        image = await this.s3Connector.createImageVersion(media._id, req.query);
        media.versionKeys = [...media.versionKeys, targetKey];
        media.save();
      }

      return image
        ? image.createReadStream().pipe(res)
        : next(new BadRequest('Image is not available'));
    } catch (err) {
      next(err);
    }
  }

  async getMedia(req, res, next) {
    const { mediaId } = req.params;

    try {
      if (mediaId) {
        const media = await Media.findById(mediaId);

        return media
          ? res.json(enrichMediaItem(media, this.appConfig.apiBaseUrl))
          : next(new NotFound('Media not found'));
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
        data: data.map(item =>
          enrichMediaItem(item, this.appConfig.apiBaseUrl)
        ),
        itemsPerPage,
        totalPages,
      });
    } catch (err) {
      next(err);
    }
  }

  getImageUrl(mediaId) {
    const { routes } = this.mediaConfig;
    const imageEndpoint = routes.getImage.split(':').shift();

    return `${imageEndpoint}${mediaId}`;
  }

  async uploadSingleImage(mediaId, file) {
    const { defaultImageFormat, maxWidth, maxHeight } = this.mediaConfig;
    try {
      const targetKey = this.utils.getMediaKey(mediaId);
      const imageBufferWithInfo = await image.process(file.path, {
        format: defaultImageFormat,
        width: maxWidth,
        height: maxHeight,
      });
      await this.s3Connector.upload(imageBufferWithInfo, targetKey);

      return {
        ...imageBufferWithInfo.info,
        targetKey,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadImages(req, res, next) {
    const { files } = req;

    try {
      const imagesUploadPromises = files.map(async file => {
        const media = new Media({
          name: path.parse(file.originalname).name,
        });
        const { width, height, format, size, targetKey } =
          await this.uploadSingleImage(media._id, file);
        media.mimetype = `image/${format}`;
        media.url = this.getImageUrl(media._id);
        media.size = size;
        media.width = width;
        media.height = height;
        media.versionKeys = media.versionKeys
          ? [...media.versionKeys, targetKey]
          : [targetKey];

        return media.save();
      });
      const mediaObjects = await Promise.all(imagesUploadPromises);

      res.json(
        mediaObjects.map(item =>
          enrichMediaItem(item, this.appConfig.apiBaseUrl)
        )
      );
      files.forEach(file => removeTempFile(file.path));
    } catch (err) {
      next(err);
    }
  }

  async updateMedia(req, res, next) {
    const { mediaId } = req.params;
    const { error } = updateMediaValidationSchema.validate(req.body);

    if (error) {
      next(new BadRequest(error.details[0].message));

      return;
    }

    try {
      const updateResult = await Media.findOneAndUpdate(
        { _id: mediaId },
        req.body,
        { new: true }
      );
      res.json(enrichMediaItem(updateResult, this.appConfig.apiBaseUrl));
    } catch (err) {
      next(err);
    }
  }

  async deleteMedia(req, res, next) {
    const { mediaId } = req.params;

    try {
      const media = await Media.findById(mediaId);
      const { versionKeys } = media;
      await Promise.all(
        versionKeys.map(key => this.s3Connector.removeObject(key))
      );
      await media.remove();
      res.send(mediaId);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MediaController;
