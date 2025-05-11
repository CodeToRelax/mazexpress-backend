import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { checkUserRules } from '@/utils/helpers';
import { CustomExpressRequest, StatusCode } from '@/utils/types';
import { Response, NextFunction } from 'express';

export const CheckUserRules = async (req: CustomExpressRequest, res: Response, next: NextFunction) => {
  try {
    const hasValidRules = await checkUserRules(req.user?.acl, req);

    if (!hasValidRules) {
      return next(
        new CustomErrorHandler(StatusCode.CLIENT_ERROR_UNAUTHORIZED, 'unauthorised_personnel', 'Unauthorized access')
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};
