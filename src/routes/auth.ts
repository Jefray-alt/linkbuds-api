import { SALT_ROUNDS } from '../config/constants';
import UserRepository from '../repository/UserRepository';
import { generateJWT } from '../utils/auth';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

const router = Router();

router.post(
  '/register',
  asyncHandler(async (req, res, next) => {
    try {
      const userRepository = new UserRepository();
      const hashedPassword = bcrypt.hashSync(
        req.body.password as string,
        SALT_ROUNDS
      );
      const userPayload = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
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

      createdUser.refreshToken = refreshToken;
      await userRepository.save(createdUser);

      res.cookie('refreshToken', refreshToken, { httpOnly: true });

      res.send({
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          createdAt: createdUser.createdAt,
          updatedAt: createdUser.updatedAt
        },
        accessToken
      });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
