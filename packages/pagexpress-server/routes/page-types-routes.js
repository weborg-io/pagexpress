import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getPageTypes,
  createPageType,
  updatePageType,
  deletePageType,
} from '../controllers/page-types-controller';

const router = Router();
router.get(
  '/page-types/:pageTypeId?',
  auth,
  grandAccess('readAny', 'pageType'),
  getPageTypes
);
router.post(
  '/page-types',
  auth,
  grandAccess('createOwn', 'pageType'),
  createPageType
);
router.put(
  '/page-types/:pageTypeId',
  auth,
  grandAccess('updateAny', 'pageType'),
  updatePageType
);
router.delete(
  '/page-types/:pageTypeId',
  auth,
  grandAccess('deleteAny', 'pageType'),
  deletePageType
);

export default router;
