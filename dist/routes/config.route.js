"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_controller_1 = require("../controllers/config.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
const jwt_middleware_1 = __importDefault(require("../middlewares/jwt.middleware"));
const config_validation_1 = require("../validation/config.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/getShippingConfig', jwt_middleware_1.default, async (req, res) => {
    try {
        const shippingConfig = await config_controller_1.ConfigController.getShippingConfig();
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
router.post('/updateShippingConfig', jwt_middleware_1.default, async (req, res) => {
    try {
        const { error } = config_validation_1.UpdateshippingConfigValidation.validate(req.body);
        if (error)
            return res.status(403).json(error);
        await config_controller_1.ConfigController.updateShippingConfig(req.body);
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
exports.default = router;
//# sourceMappingURL=config.route.js.map