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
  const { page: _p, limit: _l, sort: _s, sortBy, paginate, ...rawFilters } = req.query;

  const page = parseInt(_p as string, 10) || 1;
  const limit = parseInt(_l as string, 10) || 10;
  const sortOrder: 1 | -1 = (_s as string)?.toLowerCase() === 'desc' ? -1 : 1;

  const sortField = (sortBy as string) || 'createdAt';
  const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

  const paginationOptions: PaginateOptions = {
    page,
    limit,
    sort,
    pagination: !!paginate,
    lean: true,
  };
  const filters = rawFilters as unknown as IShipmentsFilters;
  const results = await ShipmentsController.getShipments(paginationOptions, filters, req.user);
  return res.status(StatusCode.SUCCESS_OK).json(results);
});

router.get('/getShipmentsUnpaginated', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
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
});

// anyone can use it for tracking shipments
router.get('/getShipment/:esn', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  if (!req.params.esn) throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
  const shipment = await ShipmentsController.getShipment(req.params.esn);
  return res.status(StatusCode.SUCCESS_OK).json(shipment);
});

// (admin per location except for mohammed)
router.post(
  '/createShipment',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(createShipmentValidation),
  async (req: CustomExpressRequest, res) => {
    const shipment = await ShipmentsController.createShipment(req.body);
    return res.status(StatusCode.SUCCESS_CREATED).json(shipment);
  }
);

// (admin per location except for mohammed)
router.patch(
  '/updateShipment/:id',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(updateShipmentValidation),
  async (req: CustomExpressRequest, res) => {
    await ShipmentsController.updateShipment(req.params.id, req.body, req.user);
    return res.status(StatusCode.SUCCESS_OK).json({ ...req.body });
  }
);

// (admin per location except for mohammed)
router.patch(
  '/updateShipments',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(updateShipmentsValidation),
  async (req: CustomExpressRequest, res) => {
    await ShipmentsController.updateShipments(req.body, req.user);
    return res.status(StatusCode.SUCCESS_OK).json({ ...req.body });
  }
);

// (admin per location except for mohammed)
router.delete(
  '/deleteShipments',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(deleteShipmentsValidation),
  async (req: CustomExpressRequest, res) => {
    await ShipmentsController.deleteShipment(req.body, req.user);
    return res.status(StatusCode.SUCCESS_OK).json('success');
  }
);

//public access
router.get('/trackShipment/:esn', async (req, res) => {
  if (!req.params.esn)
    throw new CustomErrorHandler(StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.errorValidation', 'common.missingInfo');
  const shipment = await ShipmentsController.getShipment(req.params.esn);
  return res.status(StatusCode.SUCCESS_OK).json(shipment);
});

router.post('/calculateShippingPrice', async (req, res) => {
  const results = await ShipmentsController.calculateShippingPrice(req.body);
  return res.status(StatusCode.SUCCESS_OK).json(results);
});

// rework here after wallet

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

// update shipment status with barcode reader
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
