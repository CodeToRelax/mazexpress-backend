import { ShipmentsController } from '@/controllers/shipments.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { checkUserRules } from '@/utils/helpers';
import { CustomExpressRequest, IShipmentsFilters } from '@/utils/types';
import {
  createShipmentValidation,
  updateShipmentValidation,
  updateShipmentsValidation,
} from '@/validation/shipments.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// check by user type and return accordingly
router.get('/getShipments', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  const { page } = req.query;
  try {
    const paginationOptions = {
      page: parseInt(page as string, 10) || 1,
      limit: 10,
    };
    const filters = { ...req.query };
    delete filters.page;
    delete filters.sort;
    delete filters.limit;
    const shipments = await ShipmentsController.getShipments(
      filters as unknown as IShipmentsFilters,
      paginationOptions,
      req.user
    );
    return res.status(200).json(shipments);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// check by user type and return accordingly
router.get('/getShipmentsUnpaginated', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  try {
    const shipments = await ShipmentsController.getShipmentsUnpaginated({}, req?.user);
    return res.status(200).json(shipments);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// anyone can use it for tracking shipments
router.get('/getShipment/:esn', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  if (!req.params.esn) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');

  try {
    const shipment = await ShipmentsController.getShipment(req.params.esn);
    return res.status(200).json(shipment);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin)
router.get('/getInvoiceShipments/:id', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
  if (!req.params.id) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
  try {
    const shipment = await ShipmentsController.getShipmentsUnpaginated(
      {
        status: 'ready for pick up',
        _id: req.params.id,
      },
      req?.user
    );
    return res.status(200).json(shipment);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin per location except for mohammed)
router.post('/createShipment', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  try {
    // validate body
    const { error } = createShipmentValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    const shipment = await ShipmentsController.createShipment(req.body);
    return res.status(200).json(shipment);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin per location except for mohammed)
router.patch('/updateShipment/:id', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
  try {
    // validate body
    const { error } = updateShipmentValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    await ShipmentsController.updateShipment(req.params.id, req.body, req.user);
    return res.status(200).json({ ...req.body });
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin per location except for mohammed)
router.patch('/updateShipments', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  try {
    // validate body
    const { error } = updateShipmentsValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    await ShipmentsController.updateShipments(req.body, req.user);
    return res.status(200).json({ ...req.body });
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

// (admin per location except for mohammed)
router.delete('/deleteShipment/:id', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
  const hasValidRules = await checkUserRules(req.user?.acl, req);
  if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

  try {
    await ShipmentsController.deleteShipment(req.params.id, req.user);
    return res.status(200).json('success');
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

router.get('/trackShipment/:esn', async (req, res) => {
  if (!req.params.esn) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
  try {
    const shipment = await ShipmentsController.getShipment(req.params.esn);
    return res.status(200).json(shipment);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

router.post('/calculateShippingPrice', async (req, res) => {
  try {
    const results = await ShipmentsController.calculateShippingPrice(req.body);
    console.log(results);
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
