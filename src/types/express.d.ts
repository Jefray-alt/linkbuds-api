import { type UserJwtPayload } from '../utils/auth';

declare global {
  namespace Express {
    export interface Request {
      user: UserJwtPayload;
    }
  }
}
