import { NotFoundError } from '../utils/errors';
import { type Request } from 'express';

export const notFoundHandler = (req: Request): void => {
  throw new NotFoundError(`${req.path} Route not found`);
};
