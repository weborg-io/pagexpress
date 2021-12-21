import { Schema, model } from 'mongoose';
import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

const templateComponentSchema = new Schema({
  componentPatternId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ComponentPattern',
  },
  childrenComponentPatterns: {
    default: undefined,
    type: [{ type: Schema.Types.ObjectId, ref: 'ComponentPattern' }],
  },
});

const pageTemplateSchema = new Schema({
  name: { type: String, require: true, min: 3, max: 30 },
  pageTypeId: { type: Schema.Types.ObjectId, require: true, ref: 'PageType' },
  components: [templateComponentSchema],
});

const templateComponentValidationSchema = Joi.object({
  componentPatternId: Joi.objectId().required(),
  childrenComponentPatterns: Joi.array().items(Joi.objectId()),
});

const pageTemplateValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  pageTypeId: Joi.objectId().required(),
  components: Joi.array().items(templateComponentValidationSchema),
});

const PageTemplate = model('PageTemplate', pageTemplateSchema);

export { pageTemplateSchema, PageTemplate, pageTemplateValidationSchema };
