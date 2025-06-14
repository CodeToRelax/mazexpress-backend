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
    const { page: _p, limit: _l, sort: _s, sortBy, paginate, ...rawFilters } = req.query;
    const page = parseInt(_p, 10) || 1;
    const limit = parseInt(_l, 10) || 10;
    const sortOrder = _s?.toLowerCase() === 'desc' ? -1 : 1;
    const sortField = sortBy || 'createdAt';
    const sort = { [sortField]: sortOrder };
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
});
router.get('/getShipmentsUnpaginated', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
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
});
router.get('/getShipment/:esn', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    if (!req.params.esn)
        throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    const shipment = await shipments_controller_1.ShipmentsController.getShipment(req.params.esn);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(shipment);
});
router.post('/createShipment', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(shipments_validation_1.createShipmentValidation), async (req, res) => {
    const shipment = await shipments_controller_1.ShipmentsController.createShipment(req.body);
    return res.status(types_1.StatusCode.SUCCESS_CREATED).json(shipment);
});
router.patch('/updateShipment/:id', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(shipments_validation_1.updateShipmentValidation), async (req, res) => {
    await shipments_controller_1.ShipmentsController.updateShipment(req.params.id, req.body, req.user);
    return res.status(types_1.StatusCode.SUCCESS_OK).json({ ...req.body });
});
router.patch('/updateShipments', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(shipments_validation_1.updateShipmentsValidation), async (req, res) => {
    await shipments_controller_1.ShipmentsController.updateShipments(req.body, req.user);
    return res.status(types_1.StatusCode.SUCCESS_OK).json({ ...req.body });
});
router.delete('/deleteShipments', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(shipments_validation_1.deleteShipmentsValidation), async (req, res) => {
    await shipments_controller_1.ShipmentsController.deleteShipment(req.body, req.user);
    return res.status(types_1.StatusCode.SUCCESS_OK).json('success');
});
router.get('/trackShipment/:esn', async (req, res) => {
    if (!req.params.esn)
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.errorValidation', 'common.missingInfo');
    const shipment = await shipments_controller_1.ShipmentsController.getShipment(req.params.esn);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(shipment);
});
router.post('/calculateShippingPrice', async (req, res) => {
    const results = await shipments_controller_1.ShipmentsController.calculateShippingPrice(req.body);
    return res.status(types_1.StatusCode.SUCCESS_OK).json(results);
});
exports.default = router;
//# sourceMappingURL=shipments.route.js.map