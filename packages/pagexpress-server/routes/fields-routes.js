import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getFieldTypes,
  createFieldType,
  updateFieldType,
  deleteFieldType,
} from '../controllers/field-types-controller';

const router = Router();
router.get(
  '/field-types/:fieldTypeId?',
  auth,
  grandAccess('readAny', 'fieldType'),
  getFieldTypes
);
router.post(
  '/field-types/',
  auth,
  grandAccess('createOwn', 'fieldType'),
  createFieldType
);
router.put(
  '/field-types/:fieldTypeId',
  auth,
  grandAccess('updateAny', 'fieldType'),
  updateFieldType
);
router.delete(
  '/field-types/:fieldTypeId',
  auth,
  grandAccess('deleteAny', 'fieldType'),
  deleteFieldType
);

export default router;
