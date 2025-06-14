"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
const jwt_middleware_1 = __importDefault(require("../middlewares/jwt.middleware"));
const helpers_1 = require("../utils/helpers");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/getShipmentsStatusCount', jwt_middleware_1.default, async (req, res) => {
    try {
        const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
        if (!hasValidRules)
            throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
        const shippingConfig = await dashboard_controller_1.DashboardController.getShipmentCountByStatus();
        return res.status(200).json(shippingConfig);
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
router.get('/getUserAndShipmentCountPerYear', jwt_middleware_1.default, async (req, res) => {
    try {
        const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
        if (!hasValidRules)
            throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
        if (!req.query.year)
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
        const results = await dashboard_controller_1.DashboardController.getUserAndShipmentCountPerYear(req.query.year);
        return res.status(200).json(results);
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
router.get('/getOrdersPerDay', jwt_middleware_1.default, async (req, res) => {
    try {
        const hasValidRules = await (0, helpers_1.checkUserRules)(req.user?.acl, req);
        if (!hasValidRules)
            throw new error_middleware_1.CustomErrorHandler(403, 'unathourised personalle', 'unathourised personalle');
        const filterDay = req.query.date;
        if (!filterDay)
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
        const [dd, mm, yyyy] = filterDay.split('/');
        if (!dd || !mm || !yyyy) {
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
        }
        const results = await dashboard_controller_1.DashboardController.getOrdersPerDay(filterDay);
        return res.status(200).json(results);
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
//# sourceMappingURL=dashboard.route.js.map