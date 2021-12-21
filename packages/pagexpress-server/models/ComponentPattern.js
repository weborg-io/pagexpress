import { Schema, model } from 'mongoose';
import {
  FieldsetModelSchema,
  fieldsetValidationSchema,
  ComponentPatternModelSchema,
  componentPatternValidationSchema,
} from './data-schemas';
import { fieldSchema } from './FieldType';

const fieldsetSchema = new Schema(FieldsetModelSchema({ fieldSchema }));
const componentPatternSchema = new Schema(
  ComponentPatternModelSchema({ fieldsetSchema, fieldSchema })
);
const ComponentPattern = model('ComponentPattern', componentPatternSchema);

export {
  componentPatternSchema,
  ComponentPattern,
  fieldsetValidationSchema,
  componentPatternValidationSchema,
};
