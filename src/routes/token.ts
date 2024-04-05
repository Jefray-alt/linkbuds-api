import { REFRESH_TOKEN_DURATION } from '../config/constants';
import UserService from '../service/userService';
import { verifyToken, generateJWT } from '../utils/auth';
import { UnauthorizedError } from '../utils/errors';
import bcrypt from 'bcrypt';
import {
  type NextFunction,
  type Request,
  type Response,
  Router
} from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const router = Router();
const userService = new UserService();

router.post(
  '/access-token',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken as string;
      if (refreshToken === undefined || refreshToken === null) {
        throw new UnauthorizedError('Refresh token is required');
      }

      const user = verifyToken(refreshToken);

      const userDB = await userService.findById(user.userId);

      if (userDB?.refreshToken == null) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const isTokenValid = await bcrypt.compare(
        refreshToken,
        userDB.refreshToken
      );

      if (!isTokenValid) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const accessToken = generateJWT({
        userId: user.userId,
        email: user.email
      });
      const newRefreshToken = generateJWT(
        {
          userId: user.userId,
          email: user.email
        },
        REFRESH_TOKEN_DURATION
      );

      await userService.updateRefreshToken(userDB.id, newRefreshToken);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      console.log('accesstoken', user);
      res.send({ accessToken });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        next(new UnauthorizedError('Token expired.'));
        return;
      }
      next(error);
    }
  })
);

export default router;
