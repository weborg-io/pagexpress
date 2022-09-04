const router = require('express').Router();
const {
  getPageStructure,
  getPageStructureBySlug,
} = require('../controllers/page-structure-controller');
const { auth, grandAccess } = require('../middlewares');

router.get(
  '/page-structure/:pageId',
  auth,
  grandAccess('readAny', 'pageTemplate'),
  getPageStructure
);
router.get(
  '/page-structure-by-slug/:slug',
  auth,
  grandAccess('readAny', 'pageTemplate'),
  getPageStructureBySlug
);

module.exports = router;
