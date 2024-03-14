import { HttpException } from '../utils/errors';
import { type NextFunction, type Request, type Response } from 'express';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof HttpException) {
    const errStatus = err.statusCode;
    const errMsg = err.message;
    res.status(errStatus).json({
      status: errStatus,
      message: errMsg
    });

    return;
  }

  res.status(500).json({
    status: 500,
    message: err.message,
    stack: err.stack
  });
};

export default errorHandler;
