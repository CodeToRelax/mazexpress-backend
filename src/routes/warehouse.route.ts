import { WarehouseController } from '@/controllers/warehouse.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { checkUserRules } from '@/utils/helpers';
import { CustomExpressRequest } from '@/utils/types';
import { createWarehouseValidation } from '@/validation/warehouse.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// --- api methods config service--- //
// works for all
router.get('/getWarehouses', AuthenticateFbJWT, async (req, res) => {
  try {
    const wareHouses = await WarehouseController.getWarehouses();
    return res.status(200).json(wareHouses);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin)
router.post('/createWarehouse', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  try {
    // validate body
    const { error } = createWarehouseValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    const warehouse = await WarehouseController.createWarehouse(req.body);
    return res.status(200).json(warehouse);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin)
router.patch('/updateWarehouse/:id', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
  try {
    // validate body
    const { error } = createWarehouseValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    await WarehouseController.updateWarehouse(req.params.id, req.body);
    return res.status(200).json({ ...req.body });
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin)
router.delete('/deleteWarehouse/:id', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
  if (!req.params.id) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');

  try {
    await WarehouseController.deleteWarehouse(req.params.id);
    return res.status(200).json('success');
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

export default router;
