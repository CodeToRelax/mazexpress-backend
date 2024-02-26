"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const warehouse_controller_1 = require("../controllers/warehouse.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
const warehouse_validation_1 = require("../validation/warehouse.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/getWarehouses', async (req, res) => {
    try {
        const wareHouses = await warehouse_controller_1.WarehouseController.getWarehouses();
        return res.status(200).json(wareHouses);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.post('/createWarehouse', async (req, res) => {
    try {
        const { error } = warehouse_validation_1.createWarehouseValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        const warehouse = await warehouse_controller_1.WarehouseController.createWarehouse(req.body);
        return res.status(200).json(warehouse);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.patch('/updateWarehouse/:id', async (req, res) => {
    try {
        const { error } = warehouse_validation_1.createWarehouseValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        await warehouse_controller_1.WarehouseController.updateWarehouse(req.params.id, req.body);
        return res.status(200).json({ ...req.body });
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.delete('/deleteWarehouse/:id', async (req, res) => {
    try {
        await warehouse_controller_1.WarehouseController.deleteWarehouse(req.params.id);
        return res.status(200).json('success');
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
exports.default = router;
//# sourceMappingURL=warehouse.route.js.map