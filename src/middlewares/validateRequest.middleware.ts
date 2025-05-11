// middlewares/ValidateRequest.ts
import { StatusCode } from '@/utils/types';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const ValidateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(StatusCode.CLIENT_ERROR_BAD_REQUEST).json({
        message: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }

    req.body = value;
    next();
    return; // 👈 this fixes the TS7030 warning
  };
};
