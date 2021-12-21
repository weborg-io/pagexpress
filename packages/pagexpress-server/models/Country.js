import { Schema, model } from 'mongoose';
import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

const countrySchema = new Schema({
  name: { type: String, min: 3, max: 50, require: true },
  code: { type: String, min: 2, max: 3, require: true },
  language: { type: String, min: 3, max: 50, require: true },
});

const countryValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  code: Joi.string().required().min(2).max(3),
  language: Joi.string().required().min(3).max(50),
});

const Country = model('Country', countrySchema);

export { Country, countrySchema, countryValidationSchema };
