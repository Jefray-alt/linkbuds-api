import { UnauthorizedError } from './errors';
import jwt from 'jsonwebtoken';

export interface UserJwtPayload {
  userId: string;
  email: string;
}

export const generateJWT = (
  payload: UserJwtPayload,
  expiresIn = '5m'
): string => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (secretKey === undefined || secretKey === null) {
    throw new Error('JWT secret key not provided');
  }
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const verifyToken = (token: string): jwt.JwtPayload => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (secretKey === undefined || secretKey === null) {
    throw new Error('JWT secret key not provided');
  }
  try {
    return jwt.verify(token, secretKey) as UserJwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    } else {
      throw error;
    }
  }
};
