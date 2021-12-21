import { Schema, model } from 'mongoose';
import uuid from 'uuid';
import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

const pageComponentSchema = new Schema({
  _id: { type: String, min: 36, max: 36, default: uuid.v4 },
  treeNodeLabel: { type: String, max: 255 },
  attributes: { type: Object },
  componentPatternId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ComponentPattern',
  },
  data: { type: Object },
  parentComponentId: { type: String, min: 36, max: 36 },
});

const pageDetailsSchema = new Schema(
  {
    components: [pageComponentSchema],
    country: { type: Schema.Types.ObjectId, require: true, ref: 'Country' },
    default: { type: Boolean, default: false },
    description: { type: String, require: true, max: 250 },
    name: { type: String, require: true, min: 3, max: 50, default: 'default' },
    pageId: { type: Schema.Types.ObjectId, require: true, ref: 'Page' },
    title: { type: String, require: true, min: 3, max: 100 },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: 'version',
  }
);

const pageComponentValidationSchema = Joi.object({
  _id: Joi.string().min(36).max(36),
  treeNodeLabel: Joi.string().max(255),
  attributes: Joi.object(),
  componentPatternId: Joi.objectId().required(),
  data: Joi.object(),
  parentComponentId: Joi.string().min(36).max(36),
});

const pageDetailsValidationSchema = Joi.object({
  attributes: Joi.object(),
  components: Joi.array().items(pageComponentValidationSchema),
  country: Joi.objectId().required(),
  default: Joi.boolean(),
  description: Joi.string().required().max(250),
  name: Joi.string().min(3).max(50).required(),
  pageId: Joi.objectId().required(),
  title: Joi.string().required().min(3).max(100),
});

const PageDetails = model('PageDetails', pageDetailsSchema);

export {
  pageComponentSchema,
  pageDetailsSchema,
  pageComponentValidationSchema,
  pageDetailsValidationSchema,
  PageDetails,
};
