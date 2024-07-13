"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shipments_controller_1 = require("../controllers/shipments.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
const jwt_middleware_1 = __importDefault(require("../middlewares/jwt.middleware"));
const helpers_1 = require("../utils/helpers");
const shipments_validation_1 = require("../validation/shipments.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/getShipments', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    const { page } = req.query;
    try {
        const paginationOptions = {
            page: parseInt(page, 10) || 1,
            limit: 10,
        };
        const filters = { ...req.query };
        delete filters.page;
        delete filters.sort;
        delete filters.limit;
        const shipments = await shipments_controller_1.ShipmentsController.getShipments(filters, paginationOptions);
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
router.get('/getShipmentsUnpaginated', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const shipments = await shipments_controller_1.ShipmentsController.getShipmentsUnpaginated();
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
router.get('/getShipment/:esn', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    if (!req.params.esn)
        throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
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
router.get('/getInvoiceShipments/:id', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    if (!req.params.id)
        throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    try {
        const shipment = await shipments_controller_1.ShipmentsController.getShipmentsUnpaginated({
            status: 'ready for pick up',
            _id: req.params.id,
        });
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
router.post('/createShipment', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
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
router.patch('/updateShipment/:id', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const { error } = shipments_validation_1.updateShipmentValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        await shipments_controller_1.ShipmentsController.updateShipment(req.params.id, req.body, req.user);
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
router.patch('/updateShipments', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        const { error } = shipments_validation_1.updateShipmentsValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        await shipments_controller_1.ShipmentsController.updateShipments(req.body, req.user);
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
router.delete('/deleteShipment/:id', jwt_middleware_1.default, async (req, res) => {
    const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
    if (!hasValidRules)
        throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
    try {
        await shipments_controller_1.ShipmentsController.deleteShipment(req.params.id, req.user);
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