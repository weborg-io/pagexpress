import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getSiteInfo,
  createSiteInfo,
  updateSiteInfo,
} from '../controllers/site-info-controller';

const router = Router();
router.get('/site-info', auth, grandAccess('readAny', 'siteInfo'), getSiteInfo);
router.post(
  '/site-info',
  auth,
  grandAccess('createOwn', 'siteInfo'),
  createSiteInfo
);
router.put(
  '/site-info',
  auth,
  grandAccess('updateAny', 'siteInfo'),
  updateSiteInfo
);

export default router;
