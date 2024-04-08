import auth from './auth';
import link from './link';
import token from './token';
import { Router } from 'express';

const router = Router();

router.use('/auth', auth);
router.use('/token', token);
router.use('/link', link);

export default router;
