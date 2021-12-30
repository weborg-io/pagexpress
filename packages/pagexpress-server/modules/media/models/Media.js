const { Schema, model } = require('mongoose');
const Joi = require('joi');

const VALID_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'svg', 'webp', 'gif'];
const ALLOW_CONTENT_TYPES = VALID_IMAGE_TYPES.map(type => `image/${type}`);

const MediaSchema = new Schema(
  {
    name: { type: String, require: true, max: 50 },
    description: { type: String, max: 100 },
    width: { type: Number, require: true },
    height: { type: Number, require: true },
    size: { type: Number, require: true },
    mimetype: { type: String, require: true, enum: ALLOW_CONTENT_TYPES },
    url: { type: String, required: true, max: 1024 },
    versionKeys: [{ type: String, max: 1024 }],
  },
  {
    timestamps: true,
  }
);

const mediaValidationSchema = Joi.object({
  name: Joi.string().required().max(50),
  description: Joi.string().max(100),
  width: Joi.number().required(),
  height: Joi.number().required(),
  size: Joi.number().required(),
  type: Joi.string()
    .required()
    .valid(`"${ALLOW_CONTENT_TYPES.join('","')}"`),
  url: Joi.string().required().max(1024),
  versionKeys: Joi.array().items(Joi.string().required().max(1024)),
});

const Media = model('Media', MediaSchema);

module.exports = {
  Media,
  MediaSchema,
  mediaValidationSchema,
};
