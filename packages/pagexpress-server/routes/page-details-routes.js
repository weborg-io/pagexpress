import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getPageDetails,
  createPageDetails,
  updatePageDetails,
  deletePageDetails,
} from '../controllers/page-details-controller';

const router = Router();
router.get(
  '/page-details/:pageDetailsId?',
  auth,
  grandAccess('readAny', 'pageDetails'),
  getPageDetails
);
router.post(
  '/page-details',
  auth,
  grandAccess('readAny', 'pageDetails'),
  createPageDetails
);
router.put(
  '/page-details/:pageDetailsId',
  auth,
  grandAccess('readAny', 'pageDetails'),
  updatePageDetails
);
router.delete(
  '/page-details/:pageDetailsId',
  auth,
  grandAccess('readAny', 'pageDetails'),
  deletePageDetails
);

export default router;
