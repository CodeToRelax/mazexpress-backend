import { DashboardController } from '@/controllers/dashboard.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { checkUserRules } from '@/utils/helpers';
import { CustomExpressRequest } from '@/utils/types';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// (admin's)
router.get('/getShipmentsStatusCount', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  try {
    const hasValidRules = await checkUserRules(req.user?.acl, req);
    if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    const shippingConfig = await DashboardController.getShipmentCountByStatus();
    return res.status(200).json(shippingConfig);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin's)
router.get('/getUserAndShipmentCountPerYear', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  try {
    const hasValidRules = await checkUserRules(req.user?.acl, req);
    if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

    if (!req.query.year) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');

    const results = await DashboardController.getUserAndShipmentCountPerYear(req.query.year as string);
    return res.status(200).json(results);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

export default router;
