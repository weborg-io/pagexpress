const { Schema, model } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const pageSchema = new Schema(
  {
    name: { type: String, require: true },
    slug: { type: String, require: true, unique: true },
    url: { type: String, min: 3, require: true },
    pageDetails: [{ type: Schema.Types.ObjectId }],
    type: { type: Schema.Types.ObjectId, require: true, ref: 'PageType' },
    attributes: { type: Object },
  },
  {
    timestamps: true,
  }
);

const pageValidationSchema = Joi.object({
  name: Joi.string().required(),
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
