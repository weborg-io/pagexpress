import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getComponentPatterns,
  createComponentPattern,
  updateComponentPattern,
  deleteComponentPattern,
} from '../controllers/component-patterns-controller';

const router = Router();
router.get(
  '/component-patterns/:componentPatternId?',
  auth,
  grandAccess('readAny', 'componentPattern'),
  getComponentPatterns
);
router.post(
  '/component-patterns',
  auth,
  grandAccess('createOwn', 'componentPattern'),
  createComponentPattern
);
router.put(
  '/component-patterns/:componentPatternId',
  auth,
  grandAccess('updateAny', 'componentPattern'),
  updateComponentPattern
);
router.delete(
  '/component-patterns/:componentPatternId',
  auth,
  grandAccess('deleteAny', 'componentPattern'),
  deleteComponentPattern
);

export default router;
