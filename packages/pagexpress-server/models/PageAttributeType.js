import { Schema, model } from 'mongoose';
import Joi from 'joi';

const pageTypeAttributeSchema = new Schema({
  type: { type: String, require: true, min: 3, max: 30 },
});

const pageTypeAttributeValidationSchema = Joi.object({
  type: Joi.string().required().min(3).max(30),
});

const PageAttributeType = model('PageAttributeType', pageTypeAttributeSchema);

export {
  pageTypeAttributeSchema,
  PageAttributeType,
  pageTypeAttributeValidationSchema,
};
