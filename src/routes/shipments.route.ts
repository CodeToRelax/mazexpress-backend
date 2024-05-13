import { ShipmentsController } from '@/controllers/shipments.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { IShipmentsFilters } from '@/utils/types';
import {
  createShipmentValidation,
  updateShipmentValidation,
  updateShipmentsValidation,
} from '@/validation/shipments.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// --- api methods config service--- //

// (admin)
router.get('/getShipments', async (req, res) => {
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
      paginationOptions,
      filters as unknown as IShipmentsFilters
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

// (admin)
router.get('/getShipment/:esn', async (req, res) => {
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
router.post('/createShipment', async (req, res) => {
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

// (admin)
router.patch('/updateShipment/:id', async (req, res) => {
  try {
    // validate body
    const { error } = updateShipmentValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    await ShipmentsController.updateShipment(req.params.id, req.body);
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
router.patch('/updateShipments', async (req, res) => {
  try {
    // validate body
    const { error } = updateShipmentsValidation.validate(req.body);
    if (error) return res.status(403).json(error);
    await ShipmentsController.updateShipments(req.body);
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
router.delete('/deleteShipment/:id', async (req, res) => {
  try {
    await ShipmentsController.deleteShipment(req.params.id);
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
