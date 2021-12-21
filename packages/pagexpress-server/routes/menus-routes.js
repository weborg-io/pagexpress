import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} from '../controllers/menus-controller';

const router = Router();
router.get('/menus/:menuId?', auth, grandAccess('readAny', 'menu'), getMenus);
router.post('/menus/', auth, grandAccess('createOwn', 'menu'), createMenu);
router.put(
  '/menus/:menuId',
  auth,
  grandAccess('updateAny', 'menu'),
  updateMenu
);
router.delete(
  '/menus/:menuId',
  auth,
  grandAccess('readAny', 'menu'),
  deleteMenu
);

export default router;
