import UserRepository from '../repository/UserRepository';
import { generateJWT } from '../utils/auth';
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

      const accessToken = generateJWT({
        userId: createdUser.id,
        email: createdUser.email
      });

      const refreshToken = generateJWT(
        {
          userId: createdUser.id,
          email: createdUser.email
        },
        '30m'
      );

      res.cookie('refreshToken', refreshToken, { httpOnly: true });

      res.send({
        user: createdUser,
        accessToken
      });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
