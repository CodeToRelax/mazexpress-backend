"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shipments_controller_1 = require("../controllers/shipments.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
const shipments_validation_1 = require("../validation/shipments.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/getShipments', async (req, res) => {
    try {
        const shipments = await shipments_controller_1.ShipmentsController.getShipments();
        return res.status(200).json(shipments);
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
router.get('/getShipment/:esn', async (req, res) => {
    try {
        const shipment = await shipments_controller_1.ShipmentsController.getShipment(req.params.esn);
        return res.status(200).json(shipment);
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
router.post('/createShipment', async (req, res) => {
    try {
        const { error } = shipments_validation_1.createShipmentValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        const shipment = await shipments_controller_1.ShipmentsController.createShipment(req.body);
        return res.status(200).json(shipment);
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
router.patch('/updateShipment/:id', async (req, res) => {
    try {
        const { error } = shipments_validation_1.updateShipmentValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        await shipments_controller_1.ShipmentsController.updateShipment(req.params.id, req.body);
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
router.delete('/deleteShipment/:id', async (req, res) => {
    try {
        await shipments_controller_1.ShipmentsController.deleteShipment(req.params.id);
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
//# sourceMappingURL=shipments.route.js.map