import { ConfigController } from '@/controllers/config.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { checkUserRules } from '@/utils/helpers';
import { CustomExpressRequest } from '@/utils/types';
import { UpdateshippingConfigValidation } from '@/validation/config.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// --- api methods config service--- //
// (admin)
router.get('/getShippingConfig', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  try {
    // const hasValidRules = await checkUserRules(req.user?.acl, req);
    // if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    const shippingConfig = await ConfigController.getShippingConfig();
    return res.status(200).json(shippingConfig);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin)
router.post('/updateShippingConfig', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  try {
    // const hasValidRules = await checkUserRules(req.user?.acl, req);
    // if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    // validate body
    const { error } = UpdateshippingConfigValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    await ConfigController.updateShippingConfig(req.body);
    return res.status(200).json({ ...req.body });
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

export default router;
