// *OK*

import { ConfigController } from '@/controllers/config.controller';
import { CheckUserRules } from '@/middlewares/checkUserRules.middleware';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { ValidateRequest } from '@/middlewares/validateRequest.middleware';
import { CustomExpressRequest, StatusCode } from '@/utils/types';
import { UpdateshippingConfigValidation } from '@/validation/config.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// (admin's)
router.get('/getShippingConfig', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    const shippingConfig = await ConfigController.getShippingConfig();
    return res.status(StatusCode.SUCCESS_OK).json(shippingConfig);
  } catch (error) {
    return error instanceof CustomErrorHandler
      ? error
      : new CustomErrorHandler(
          StatusCode.SERVER_ERROR_INTERNAL,
          'internalServerError',
          'Internal server error occured please reach to support',
          error
        );
  }
});

// (admin's)
router.post(
  '/updateShippingConfig',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(UpdateshippingConfigValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      await ConfigController.updateShippingConfig(req.body);
      return res.status(StatusCode.SUCCESS_OK).json({ ...req.body });
    } catch (error) {
      return error instanceof CustomErrorHandler
        ? error
        : new CustomErrorHandler(
            StatusCode.SERVER_ERROR_INTERNAL,
            'internalServerError',
            'Internal server error occured please reach to support',
            error
          );
    }
  }
);

export default router;
