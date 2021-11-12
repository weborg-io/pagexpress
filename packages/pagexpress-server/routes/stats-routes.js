const router = require('express').Router();
const { auth, grandAccess } = require('../middlewares');
const { componentUsage } = require('../controllers/stats-controller');

router.get(
  '/stats/component-usage/:componentName',
  auth,
  grandAccess('readAny', 'stats'),
  componentUsage
);

module.exports = router;
