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
  const wareHouses = await WarehouseController.getWarehouses();
  return res.status(StatusCode.SUCCESS_OK).json(wareHouses);
});

router.post(
  '/createWarehouse',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(createWarehouseValidation),
  async (req: CustomExpressRequest, res) => {
    const warehouse = await WarehouseController.createWarehouse(req.body);
    return res.status(StatusCode.SUCCESS_OK).json(warehouse);
  }
);

router.patch(
  '/updateWarehouse/:id',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(createWarehouseValidation),
  async (req: CustomExpressRequest, res) => {
    await WarehouseController.updateWarehouse(req.params.id, req.body);
    return res.status(StatusCode.SUCCESS_OK).json({ ...req.body });
  }
);

router.delete('/deleteWarehouse/:id', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  if (!req.params.id)
    throw new CustomErrorHandler(StatusCode.CLIENT_ERROR_FORBIDDEN, 'common.errorValidation', 'common.missingInfo');
  await WarehouseController.deleteWarehouse(req.params.id);
  return res.status(StatusCode.SUCCESS_OK).json('success');
});

export default router;
