import { ShipmentsController } from '@/controllers/shipments.controller';
import { CheckUserRules } from '@/middlewares/checkUserRules.middleware';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { ValidateRequest } from '@/middlewares/validateRequest.middleware';
import { CustomExpressRequest, IShipmentsFilters, StatusCode } from '@/utils/types';
import {
  createShipmentValidation,
  deleteShipmentsValidation,
  updateShipmentValidation,
  updateShipmentsValidation,
} from '@/validation/shipments.validation';
import { Router } from 'express';
import { PaginateOptions } from 'mongoose';

const router = Router({
  caseSensitive: true,
});

router.get('/getShipments', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    const { page: _p, limit: _l, sort: _s, paginate, ...rawFilters } = req.query;

    // Extract pagination options with defaults
    const page = parseInt(_p as string, 10) || 1;
    const limit = parseInt(_l as string, 10) || 10;
    const sort = _s || 'asc';
    const paginationOptions: PaginateOptions = {
      page,
      limit,
      sort,
      pagination: !!paginate,
      lean: true, // return plain JS objects
    };
    const filters = rawFilters as unknown as IShipmentsFilters;
    const results = await ShipmentsController.getShipments(paginationOptions, filters, req.user);
    return res.status(StatusCode.SUCCESS_OK).json(results);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

router.get('/getShipmentsUnpaginated', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    const { page: _p, limit: _l, sort: _s, ...rawFilters } = req.query;

    // Extract pagination options with defaults
    const page = parseInt(_p as string, 10) || 1;
    const limit = parseInt(_l as string, 10) || 10;
    const sort = _s || 'asc';
    const paginationOptions: PaginateOptions = {
      page,
      limit,
      sort,
      pagination: false,
      lean: true, // return plain JS objects
    };
    const filters = rawFilters as unknown as IShipmentsFilters;
    const results = await ShipmentsController.getShipments(paginationOptions, filters, req.user);
    return res.status(StatusCode.SUCCESS_OK).json(results);
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

// anyone can use it for tracking shipments
router.get('/getShipment/:esn', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  if (!req.params.esn) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
  try {
    const shipment = await ShipmentsController.getShipment(req.params.esn);
    return res.status(StatusCode.SUCCESS_OK).json(shipment);
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

// (admin per location except for mohammed)
router.post(
  '/createShipment',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(createShipmentValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      const shipment = await ShipmentsController.createShipment(req.body);
      return res.status(StatusCode.SUCCESS_CREATED).json(shipment);
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

// (admin per location except for mohammed)
router.patch(
  '/updateShipment/:id',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(updateShipmentValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      await ShipmentsController.updateShipment(req.params.id, req.body, req.user);
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

// (admin per location except for mohammed)
router.patch(
  '/updateShipments',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(updateShipmentsValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      await ShipmentsController.updateShipments(req.body, req.user);
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

// (admin per location except for mohammed)
router.delete(
  '/deleteShipments',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(deleteShipmentsValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      await ShipmentsController.deleteShipment(req.body, req.user);
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
  }
);

//public access
router.get('/trackShipment/:esn', async (req, res) => {
  if (!req.params.esn)
    throw new CustomErrorHandler(StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.errorValidation', 'common.missingInfo');
  try {
    const shipment = await ShipmentsController.getShipment(req.params.esn);
    return res.status(StatusCode.SUCCESS_OK).json(shipment);
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

router.post('/calculateShippingPrice', async (req, res) => {
  try {
    const results = await ShipmentsController.calculateShippingPrice(req.body);
    return res.status(StatusCode.SUCCESS_OK).json(results);
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

// rework here

// (admin)
// router.get('/getInvoiceShipments/:id', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
//   const hasValidRules = await checkUserRules(req.user?.acl, req);
//   if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
//   if (!req.params.id) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
//   try {
//     const shipment = await ShipmentsController.getShipmentsUnpaginated(
//       {
//         status: 'ready for pick up',
//         _id: req.params.id,
//       },
//       req?.user
//     );
//     return res.status(200).json(shipment);
//   } catch (error) {
//     if (error instanceof CustomErrorHandler) {
//       throw error;
//     } else {
//       throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
//     }
//   }
// });

// router.patch('/updateShipmentsEsn', AuthenticateFbJWT, async (req: CustomExpressRequest, res) => {
//   const hasValidRules = await checkUserRules(req.user?.acl, req);
//   if (!hasValidRules) throw new CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');

//   try {
//     // validate body
//     const { error } = updateShipmentsBarCodeValidation.validate(req.body);
//     if (error) return res.status(403).json(error);
//     await ShipmentsController.updateShipmentsEsn(req.body, req.user);
//     return res.status(200).json({ ...req.body });
//   } catch (error) {
//     if (error instanceof CustomErrorHandler) {
//       throw error;
//     } else {
//       throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
//     }
//   }
// });

export default router;
