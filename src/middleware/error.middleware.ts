import { HttpException } from '../utils/errors';
import { type Request, type Response } from 'express';

const errorHandler = (err: unknown, _req: Request, res: Response): void => {
  if (err instanceof HttpException) {
    const errStatus = err.statusCode;
    const errMsg = err.message;
    res.status(errStatus).json({
      status: errStatus,
      message: errMsg
    });
  }
};

export default errorHandler;
