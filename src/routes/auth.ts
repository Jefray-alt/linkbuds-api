import {
  COOKIE_MAX_AGE,
  REFRESH_TOKEN_DURATION,
  SALT_ROUNDS
} from '../config/constants';
import UserService from '../service/userService';
import { type LoginPayload } from '../types/payload';
import { generateJWT } from '../utils/auth';
import { BadRequestErrror, UnauthorizedError } from '../utils/errors';
import {
  UserLoginPayload,
  UserRegistrationPayload
} from '../validations/User/User.validations';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

const router = Router();
const userService = new UserService();

router.post(
  '/register',
  asyncHandler(async (req, res, next) => {
    try {
      await UserRegistrationPayload.validateAsync(req.body);

      const isUserExisting = await userService.findByEmail(
        req.body.email as string
      );

      if (isUserExisting !== null) {
        throw new BadRequestErrror('User already exists');
      }

      const hashedPassword = bcrypt.hashSync(
        req.body.password as string,
        bcrypt.genSaltSync(SALT_ROUNDS)
      );

      const userPayload = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      };

      const createdUser = await userService.save(userPayload);

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

      createdUser.refreshToken = bcrypt.hashSync(
        refreshToken,
        bcrypt.genSaltSync(SALT_ROUNDS)
      );

      await userService.save(createdUser);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: false,
        maxAge: COOKIE_MAX_AGE
      });

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
      const loginPayload = req.body as LoginPayload;

      await UserLoginPayload.validateAsync(loginPayload);

      const user = await userService.findByEmail(loginPayload.email, {
        refreshToken: true,
        password: true
      });

      if (user == null) {
        throw new UnauthorizedError('User not found');
      }

      const isPasswordValid = bcrypt.compareSync(
        loginPayload.password,
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

      await userService.updateRefreshToken(user.id, refreshToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: false,
        maxAge: COOKIE_MAX_AGE
      });

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

router.post(
  '/logout',
  asyncHandler(async (req, res, next) => {
    try {
      const user = await userService.findById(req.user.userId);
      if (user === null) {
        throw new UnauthorizedError('User is not logged in');
      }
      user.refreshToken = null;

      await userService.save(user);
      res.clearCookie('refreshToken');
      res.send({
        message: 'Logout successful'
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
      const user = await userService.findById(req.user.userId);

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
