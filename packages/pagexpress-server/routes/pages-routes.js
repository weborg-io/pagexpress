import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getPages,
  createPage,
  updatePage,
  deletePage,
} from '../controllers/pages-controller';

const router = Router();
router.get('/pages/:pageId?', auth, grandAccess('readAny', 'page'), getPages);
router.post('/pages', auth, grandAccess('createOwn', 'page'), createPage);
router.put(
  '/pages/:pageId',
  auth,
  grandAccess('updateAny', 'page'),
  updatePage
);
router.delete(
  '/pages/:pageId',
  auth,
  grandAccess('deleteAny', 'page'),
  deletePage
);

export default router;
