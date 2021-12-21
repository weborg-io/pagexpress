import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getPageAttributeTypes,
  createPageAttributeType,
  updatePageAttributeType,
  deletePageAttributeType,
} from '../controllers/page-attribute-types-controller';

const router = Router();
router.get(
  '/page-attribute-types/:pageAttributeTypeId?',
  auth,
  grandAccess('readAny', 'pageAttributeType'),
  getPageAttributeTypes
);
router.post(
  '/page-attribute-types',
  auth,
  grandAccess('createOwn', 'pageAttributeType'),
  createPageAttributeType
);
router.put(
  '/page-attribute-types/:pageAttributeTypeId',
  auth,
  grandAccess('updateAny', 'pageAttributeType'),
  updatePageAttributeType
);
router.delete(
  '/page-attribute-types/:pageAttributeTypeId',
  auth,
  grandAccess('deleteAny', 'pageAttributeType'),
  deletePageAttributeType
);

export default router;
