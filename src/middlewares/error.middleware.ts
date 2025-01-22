import { NextFunction, Request, Response } from 'express';

interface ICustomError extends Error {
  statusCode: number;
  errorCode: string;
  errorDescription: string;
  rawError: Record<string, unknown>;
}

export class CustomErrorHandler extends Error {
  statusCode: number;
  rawError: Record<string, unknown> | unknown;

  constructor(
    statusCode: number,
    errorCode: string,
    errorDescription: string,
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
    this.statusCode = statusCode;
    this.name = errorCode;
    this.message = errorDescription;
    this.rawError = rawError;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ErrorMiddleware = (error: ICustomError, _req: Request, res: Response, _next: NextFunction) => {
  return res.status(error.statusCode).json(error);
};
