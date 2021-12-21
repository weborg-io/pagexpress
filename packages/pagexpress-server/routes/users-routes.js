import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  authUser,
  getUsers,
  createUser,
  resetPassword,
  deleteUser,
} from '../controllers/users-controller';

const router = Router();
router.get('/users/me', auth, grandAccess('readOwn', 'user'), authUser);
router.get('/users/:userId?', auth, grandAccess('readAny', 'user'), getUsers);
router.post('/users', createUser);
router.put(
  '/users/:userId',
  auth,
  grandAccess('updateAny', 'user'),
  resetPassword
);
router.delete(
  '/users/:userId',
  auth,
  grandAccess('deleteAny', 'user'),
  deleteUser
);

export default router;
