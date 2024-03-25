import { nonSecurePaths } from '../routes/paths';
import { verifyToken, type UserJwtPayload } from '../utils/auth';
import { UnauthorizedError } from '../utils/errors';
import { type NextFunction, type Request, type Response } from 'express';

export const tokenDecode = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    if (nonSecurePaths.includes(req.path)) {
      next();
      return;
    }
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (token === null || token === undefined) {
      throw new UnauthorizedError('Token not provided.');
    }

    const decodedToken = verifyToken(token);
    if (decodedToken === undefined || decodedToken === null) {
      throw new UnauthorizedError('Token not valid.');
    }
    req.user = decodedToken as UserJwtPayload;
    next();
  } catch (error) {
    next(error);
  }
};
