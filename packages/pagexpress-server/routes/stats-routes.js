import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import { componentUsage } from '../controllers/stats-controller';

const router = Router();
router.get(
  '/stats/component-usage/:componentId',
  auth,
  grandAccess('readAny', 'stats'),
  componentUsage
);

export default router;
