export class HttpException extends Error {
  public statusCode: number;
  public message: string;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class NotFoundError extends HttpException {
  constructor(message = 'Not found') {
    super(404, message);
  }
}

export class UnauthorizedError extends HttpException {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class BadRequestErrror extends HttpException {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}
