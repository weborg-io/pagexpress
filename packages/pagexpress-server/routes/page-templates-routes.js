import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getPageTemplates,
  createPageTemplate,
  updatePageTemplate,
  deletePageTemplate,
} from '../controllers/page-templates-controller';

const router = Router();
router.get(
  '/page-templates/:pageTemplateId?',
  auth,
  grandAccess('readAny', 'pageTemplate'),
  getPageTemplates
);
router.post(
  '/page-templates',
  auth,
  grandAccess('createOwn', 'pageTemplate'),
  createPageTemplate
);
router.put(
  '/page-templates/:pageTemplateId',
  auth,
  grandAccess('updateAny', 'pageTemplate'),
  updatePageTemplate
);
router.delete(
  '/page-templates/:pageTemplateId',
  auth,
  grandAccess('deleteAny', 'pageTemplate'),
  deletePageTemplate
);

export default router;
