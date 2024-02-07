import { NextFunction, Request, Response } from 'express';

interface ICustomError extends Error {
  title: string;
  description: string;
  data: Record<string, unknown>;
  statusCode: number;
}

export class CustomErrorHandler extends Error {
  rawError: Record<string, unknown> | unknown;
  data: Record<string, unknown> | unknown;
  statusCode: number;

  constructor(
    statusCode: number,
    title: string,
    description: string,
    rawError?: Record<string, unknown> | unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...params: any[]
  ) {
    super(...params);

    // set default params
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, CustomErrorHandler);
    // }
    this.name = title;
    this.message = description;
    this.rawError = rawError;
    this.data = this.sanatizeError();
    this.statusCode = statusCode;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sanatizeError(): Record<string, any> | unknown {
    if ((this.rawError as { errorInfo: { code: string } }).errorInfo) {
      return {
        statusCode: 403,
        error: 'firebase',
      };
    }
    return this.rawError;
  }
}

export const ErrorMiddleware = (error: ICustomError, _req: Request, res: Response, _next: NextFunction) => {
  return res.status(error.statusCode).json(error);
};
