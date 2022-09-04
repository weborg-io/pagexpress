const { Gallery, galleryValidationSchema } = require('../models/Gallery');
const { BadRequest, NotFound } = require('../../../utils/errors');
const { enrichMediaItem } = require('../tools/image');

class GalleryController {
  constructor(pxConfig) {
    this.appConfig = pxConfig;
    this.getGallery = this.getGallery.bind(this);
    this.getGalleryByName = this.getGalleryByName.bind(this);
    this.createGallery = this.createGallery.bind(this);
    this.updateGallery = this.updateGallery.bind(this);
    this.deleteGallery = this.deleteGallery.bind(this);
    this.enrichGallery = this.enrichGallery.bind(this);
  }

  async getGallery(req, res, next) {
    const { galleryId } = req.params;

    try {
      if (galleryId) {
        const gallery = await Gallery.findById(galleryId)
          .populate({
            path: 'images',
            model: 'Media',
            select: 'name url width height mimetype',
          })
          .exec();

        if (gallery) {
          res.json(this.enrichGallery(gallery));
        } else {
          next(new NotFound('Gallery not found'));
        }

        return;
      }

      const galleries = await Gallery.find().select('name');
      res.json(galleries.map(this.enrichGallery));
    } catch (err) {
      next(err);
    }
  }

  async getGalleryByName(req, res, next) {
    const { name } = req.params;

    try {
      const gallery = await Gallery.findOne({ name })
        .populate({
          path: 'images',
          model: 'Media',
          select: 'name url width height mimetype',
        })
        .exec();

      if (gallery) {
        res.json(this.enrichGallery(gallery));
      } else {
        next(new NotFound('Gallery not found'));
      }
    } catch (err) {
      next(err);
    }
  }

  enrichGallery(gallery) {
    const galleryData = gallery.toObject ? gallery.toObject() : gallery;

    return {
      ...galleryData,
      images: galleryData.images
        ? galleryData.images.map(image =>
            enrichMediaItem(image, this.appConfig.apiBaseUrl)
          )
        : undefined,
    };
  }

  async createGallery(req, res, next) {
    const { error } = galleryValidationSchema.validate(req.body);

    if (error) {
      next(BadRequest(error.details[0].message));

      return;
    }

    try {
      const gallery = new Gallery(req.body);
      await gallery.save();
      res.send(gallery._id);
    } catch (err) {
      next(err);
    }
  }

  async updateGallery(req, res, next) {
    const { galleryId } = req.params;
    const { error } = galleryValidationSchema.validate(req.body);

    if (error) {
      next(BadRequest(error.details[0].message));

      return;
    }

    try {
      const updateResult = await Gallery.findOneAndUpdate(
        { _id: galleryId },
        req.body,
        { new: true }
      );
      res.json(this.enrichGallery(updateResult));
    } catch (err) {
      next(err);
    }
  }

  async deleteGallery(req, res, next) {
    const { galleryId } = req.params;

    try {
      await Gallery.findOneAndRemove(galleryId);
      res.send(galleryId);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = GalleryController;
