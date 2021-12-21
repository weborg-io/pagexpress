import { Router } from 'express';
import { getPageStructure } from '../controllers/page-structure-controller';

const router = Router();
router.get('/page-structure/:pageId', getPageStructure);

export default router;
