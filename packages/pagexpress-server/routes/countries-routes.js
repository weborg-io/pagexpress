import { Router } from 'express';
import { auth, grandAccess } from '../middlewares';
import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} from '../controllers/countries-controller';

const router = Router();
router.get(
  '/countries/:countryId?',
  auth,
  grandAccess('readAny', 'country'),
  getCountries
);
router.post(
  '/countries',
  auth,
  grandAccess('createOwn', 'country'),
  createCountry
);
router.put(
  '/countries/:countryId',
  auth,
  grandAccess('updateAny', 'country'),
  updateCountry
);
router.delete(
  '/countries/:countryId',
  auth,
  grandAccess('deleteAny', 'country'),
  deleteCountry
);

export default router;
