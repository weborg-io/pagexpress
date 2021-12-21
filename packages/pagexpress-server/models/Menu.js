import { Schema, model } from 'mongoose';
import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

const menuItemSchema = new Schema(
  {
    label: { type: String, require: true, min: 2, max: 50 },
    url: { type: String, require: true, min: 1, max: 250 },
    title: { type: String, min: 3, max: 50 },
    children: {
      default: undefined,
      type: [this],
    },
  },
  { _id: false }
);

const menuSchema = new Schema({
  name: { type: String, require: true, unique: true, min: 3, max: 50 },
  items: [menuItemSchema],
});

const menuItemSchemaValidationSchema = Joi.object({
  label: Joi.string().required().min(2).max(50),
  url: Joi.string().uri({ allowRelative: true }).required().min(1).max(250),
  title: Joi.string().min(3).max(250),
  children: Joi.array().items(Joi.link('#menuItem')),
}).id('menuItem');

const menuValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  items: Joi.array().items(menuItemSchemaValidationSchema),
});

const Menu = model('Menu', menuSchema);

export { menuItemSchema, menuValidationSchema, Menu };
