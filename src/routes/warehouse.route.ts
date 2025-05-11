// *OK*

import { WarehouseController } from '@/controllers/warehouse.controller';
import { CheckUserRules } from '@/middlewares/checkUserRules.middleware';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { ValidateRequest } from '@/middlewares/validateRequest.middleware';
import { CustomExpressRequest, StatusCode } from '@/utils/types';
import { createWarehouseValidation } from '@/validation/warehouse.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

router.get('/getWarehouses', AuthenticateFbJWT, async (_, res) => {
  try {
    const wareHouses = await WarehouseController.getWarehouses();
    return res.status(StatusCode.SUCCESS_OK).json(wareHouses);
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

router.post(
  '/createWarehouse',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(createWarehouseValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      const warehouse = await WarehouseController.createWarehouse(req.body);
      return res.status(StatusCode.SUCCESS_OK).json(warehouse);
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

router.patch(
  '/updateWarehouse/:id',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(createWarehouseValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      await WarehouseController.updateWarehouse(req.params.id, req.body);
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

router.delete('/deleteWarehouse/:id', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  if (!req.params.id)
    throw new CustomErrorHandler(StatusCode.CLIENT_ERROR_FORBIDDEN, 'common.errorValidation', 'common.missingInfo');
  try {
    await WarehouseController.deleteWarehouse(req.params.id);
    return res.status(StatusCode.SUCCESS_OK).json('success');
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

export default router;
