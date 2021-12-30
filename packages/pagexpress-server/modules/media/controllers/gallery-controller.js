const { Gallery, galleryValidationSchema } = require('../models/Gallery');
const { BadRequest, NotFound } = require('../../../utils/errors');

class GalleryController {
  constructor() {
    this.getGallery = this.getGallery.bind(this);
    this.createGallery = this.createGallery.bind(this);
    this.updateGallery = this.updateGallery.bind(this);
    this.deleteGallery = this.deleteGallery.bind(this);
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
          res.json(gallery);
        } else {
          next(new NotFound('Gallery not found'));
        }

        return;
      }

      const galleries = await Gallery.find();

      res.json(galleries);
    } catch (err) {
      next(err);
    }
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
      res.json(updateResult);
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
