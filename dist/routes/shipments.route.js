"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shipments_controller_1 = require("../controllers/shipments.controller");
const checkUserRules_middleware_1 = require("../middlewares/checkUserRules.middleware");
const error_middleware_1 = require("../middlewares/error.middleware");
const jwt_middleware_1 = __importDefault(require("../middlewares/jwt.middleware"));
const validateRequest_middleware_1 = require("../middlewares/validateRequest.middleware");
const types_1 = require("../utils/types");
const shipments_validation_1 = require("../validation/shipments.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/getShipments', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        const { page: _p, limit: _l, sort: _s, paginate, ...rawFilters } = req.query;
        const page = parseInt(_p, 10) || 1;
        const limit = parseInt(_l, 10) || 10;
        const sort = _s || 'asc';
        const paginationOptions = {
            page,
            limit,
            sort,
            pagination: !!paginate,
            lean: true,
        };
        const filters = rawFilters;
        const results = await shipments_controller_1.ShipmentsController.getShipments(paginationOptions, filters, req.user);
        return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
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
router.get('/getShipmentsUnpaginated', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        const { page: _p, limit: _l, sort: _s, ...rawFilters } = req.query;
        const page = parseInt(_p, 10) || 1;
        const limit = parseInt(_l, 10) || 10;
        const sort = _s || 'asc';
        const paginationOptions = {
            page,
            limit,
            sort,
            pagination: false,
            lean: true,
        };
        const filters = rawFilters;
        const results = await shipments_controller_1.ShipmentsController.getShipments(paginationOptions, filters, req.user);
        return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
router.get('/getShipment/:esn', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    if (!req.params.esn)
        throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    try {
        const shipment = await shipments_controller_1.ShipmentsController.getShipment(req.params.esn);
        return res.status(types_1.StatusCode.SUCCESS_OK).json(shipment);
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
router.post('/createShipment', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(shipments_validation_1.createShipmentValidation), async (req, res) => {
    try {
        const shipment = await shipments_controller_1.ShipmentsController.createShipment(req.body);
        return res.status(types_1.StatusCode.SUCCESS_CREATED).json(shipment);
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
router.patch('/updateShipment/:id', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(shipments_validation_1.updateShipmentValidation), async (req, res) => {
    try {
        await shipments_controller_1.ShipmentsController.updateShipment(req.params.id, req.body, req.user);
        return res.status(types_1.StatusCode.SUCCESS_OK).json({ ...req.body });
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
router.patch('/updateShipments', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(shipments_validation_1.updateShipmentsValidation), async (req, res) => {
    try {
        await shipments_controller_1.ShipmentsController.updateShipments(req.body, req.user);
        return res.status(types_1.StatusCode.SUCCESS_OK).json({ ...req.body });
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
router.delete('/deleteShipments', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(shipments_validation_1.deleteShipmentsValidation), async (req, res) => {
    try {
        await shipments_controller_1.ShipmentsController.deleteShipment(req.body, req.user);
        return res.status(types_1.StatusCode.SUCCESS_OK).json('success');
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
router.get('/trackShipment/:esn', async (req, res) => {
    if (!req.params.esn)
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.errorValidation', 'common.missingInfo');
    try {
        const shipment = await shipments_controller_1.ShipmentsController.getShipment(req.params.esn);
        return res.status(types_1.StatusCode.SUCCESS_OK).json(shipment);
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
router.post('/calculateShippingPrice', async (req, res) => {
    try {
        const results = await shipments_controller_1.ShipmentsController.calculateShippingPrice(req.body);
        return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
exports.default = router;
//# sourceMappingURL=shipments.route.js.map