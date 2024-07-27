import { HttpException } from '../utils/errors';
import { type NextFunction, type Request, type Response } from 'express';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (err.isJoi) {
    const errStatus = 422;
    const errMsg = err.message.replace(/['"]/g, '');
    res.status(errStatus).json({
      status: errStatus,
      message: errMsg
    });

    return;
  }

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
