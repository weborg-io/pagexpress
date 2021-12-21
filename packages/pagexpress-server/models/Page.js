import { Schema, model } from 'mongoose';
import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

const pageSchema = new Schema(
  {
    name: { type: String, require: true },
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
  name: Joi.string().required(),
  url: Joi.string().required(),
  pageDetails: Joi.array().items(Joi.objectId()),
  type: Joi.objectId().required(),
  attributes: Joi.object(),
});

const Page = model('Page', pageSchema);

export { pageValidationSchema, pageSchema, Page };
