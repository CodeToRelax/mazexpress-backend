import { NextFunction, Request, Response } from 'express';

interface ICustomError extends Error {
  errorType?: 'firebase' | 'mongo' | 'unkwown';
  title: string;
  description: string;
  statusCode: number;
  data: Record<string, unknown>;
}

export class CustomErrorHandler extends Error {
  errorType: 'firebase' | 'mongo' | 'unkwown';
  statusCode: number;
  data: Record<string, unknown>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    title: string,
    description: string,
    errorType: ICustomError['errorType'],
    statusCode = 500,
    data = {},
    ...params: any[]
  ) {
    super(...params);

    // set default params
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, CustomErrorHandler);
    // }
    //error title
    this.name = title;
    //error description
    this.message = description;
    // status code
    this.statusCode = statusCode;
    // error type
    this.errorType = errorType || 'unkwown';
    this.data = data;
  }
}

export const ErrorMiddleware = (error: ICustomError, _req: Request, res: Response, _next: NextFunction) => {
  return res.status(error.statusCode || 500).json(error);
};
