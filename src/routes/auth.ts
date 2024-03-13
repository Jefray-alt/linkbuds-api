import UserRepository from '../repository/UserRepository';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

const router = Router();

router.post(
  '/register',
  asyncHandler(async (req, res, next) => {
    try {
      const userRepository = new UserRepository();
      const userPayload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };
      const createdUser = await userRepository.save(userPayload);
      res.send({
        user: createdUser
      });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
