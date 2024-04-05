import auth from './auth';
import token from './token';
import { Router } from 'express';

const router = Router();

router.use('/auth', auth);
router.use('/token', token);

export default router;
