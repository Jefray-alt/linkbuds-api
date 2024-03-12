import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  username: string;
  email: string;
}

export const generateJWT = (payload: JWTPayload, expiresIn = '5m'): string => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (secretKey === undefined || secretKey === null) {
    throw new Error('JWT secret key not provided');
  }
  return jwt.sign(payload, secretKey, { expiresIn });
};
