import { WarehouseController } from '@/controllers/warehouse.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import { createWarehouseValidation } from '@/validation/warehouse.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// --- api methods config service--- //

// (admin)
router.get('/getWarehouses', async (req, res) => {
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
router.post('/createWarehouse', async (req, res) => {
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
router.patch('/updateWarehouse/:id', async (req, res) => {
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
router.delete('/deleteWarehouse/:id', async (req, res) => {
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
