const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const pageSchema = new Schema(
  {
    slug: { type: String, min: 3, unique: true, require: true },
    url: { type: String, require: true },
    pageDetails: [{ type: Schema.Types.ObjectId }],
    type: { type: Schema.Types.ObjectId, require: true, ref: 'PageType' },
    attributes: { type: Object },
  },
  {
    timestamps: true,
  }
);

const pageValidationSchema = Joi.object({
  slug: Joi.string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(3)
    .required(),
  url: Joi.string().required(),
  pageDetails: Joi.array().items(Joi.objectId()),
  type: Joi.objectId().required(),
  attributes: Joi.object(),
});

const Page = model('Page', pageSchema);

module.exports = {
  pageValidationSchema,
  pageSchema,
  Page,
};
