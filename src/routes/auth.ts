import { REFRESH_TOKEN_DURATION, SALT_ROUNDS } from '../config/constants';
import UserRepository from '../repository/UserRepository';
import { generateJWT } from '../utils/auth';
import { UnauthorizedError } from '../utils/errors';
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
        bcrypt.genSaltSync(SALT_ROUNDS)
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
        REFRESH_TOKEN_DURATION
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

router.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    try {
      const userRepository = new UserRepository();
      const user = await userRepository.findByEmail(req.body.email as string);

      if (user == null) {
        throw new UnauthorizedError('User not found');
      }

      const isPasswordValid = bcrypt.compareSync(
        req.body.password as string,
        user.password
      );

      if (!isPasswordValid) {
        throw new UnauthorizedError('User not found');
      }

      const accessToken = generateJWT({
        userId: user.id,
        email: user.email
      });

      const refreshToken = generateJWT(
        {
          userId: user.id,
          email: user.email
        },
        REFRESH_TOKEN_DURATION
      );

      await userRepository.updateRefreshToken(user.id, refreshToken);

      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      res.send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken
      });
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  '/user',
  asyncHandler(async (req, res, next) => {
    try {
      const userRepository = new UserRepository();
      const user = await userRepository.findById(req.user.userId);

      if (user === null) {
        throw new UnauthorizedError('User not found');
      }

      res.send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
