import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getDefinitions,
  createDefinition,
  updateDefinition,
  deleteDefinition,
} from '../controllers/definitions-controller';

const router = Router();
router.get(
  '/definitions/:definitionId?',
  auth,
  grandAccess('readAny', 'definition'),
  getDefinitions
);
router.post(
  '/definitions',
  auth,
  grandAccess('createOwn', 'definition'),
  createDefinition
);
router.put(
  '/definitions/:definitionId',
  auth,
  grandAccess('updateAny', 'definition'),
  updateDefinition
);
router.delete(
  '/definitions/:definitionId',
  auth,
  grandAccess('deleteAny', 'definition'),
  deleteDefinition
);

export default router;
