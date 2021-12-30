const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const GallerySchema = new Schema(
  {
    name: { type: String, require: true, max: 50 },
    images: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
  },
  {
    timestamps: true,
  }
);

const galleryValidationSchema = Joi.object({
  name: Joi.string().required().max(50),
  images: Joi.array().items(Joi.objectId()),
});

const Gallery = model('Gallery', GallerySchema);

module.exports = {
  Gallery,
  GallerySchema,
  galleryValidationSchema,
};
