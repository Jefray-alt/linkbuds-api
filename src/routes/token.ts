import { REFRESH_TOKEN_DURATION } from '../config/constants';
import UserService from '../service/userService';
import { type UserJwtPayload, verifyToken, generateJWT } from '../utils/auth';
import { UnauthorizedError } from '../utils/errors';
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

      const user = verifyToken(refreshToken) as UserJwtPayload;

      const userDB = await userService.findById(user.userId);
      if (userDB?.refreshToken !== refreshToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const accessToken = generateJWT(user);
      const newRefreshToken = generateJWT(user, REFRESH_TOKEN_DURATION);

      await userService.updateRefreshToken(userDB.id, newRefreshToken);
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
