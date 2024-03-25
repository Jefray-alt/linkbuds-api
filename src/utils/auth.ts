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

export const isTokenExpired = (token: string): boolean => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (secretKey === undefined || secretKey === null) {
    throw new Error('JWT secret key not provided');
  }
  try {
    jwt.verify(token, secretKey);
    return false;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Token is already expired');
    } else {
      console.log('Token is invalid');
    }

    return true;
  }
};
