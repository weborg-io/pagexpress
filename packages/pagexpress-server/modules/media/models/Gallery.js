const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const GallerySchema = new Schema(
  {
    name: { type: String, require: true, max: 50 },
    slug: { type: String, min: 3, unique: true, require: true },
    images: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
  },
  {
    timestamps: true,
  }
);

const galleryValidationSchema = Joi.object({
  name: Joi.string().required().max(50),
  slug: Joi.string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(3)
    .required(),
  images: Joi.array().items(Joi.objectId()),
});

const Gallery = model('Gallery', GallerySchema);

module.exports = {
  Gallery,
  GallerySchema,
  galleryValidationSchema,
};
