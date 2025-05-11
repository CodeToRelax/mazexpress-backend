"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_controller_1 = require("../controllers/config.controller");
const checkUserRules_middleware_1 = require("../middlewares/checkUserRules.middleware");
const error_middleware_1 = require("../middlewares/error.middleware");
const jwt_middleware_1 = __importDefault(require("../middlewares/jwt.middleware"));
const validateRequest_middleware_1 = require("../middlewares/validateRequest.middleware");
const types_1 = require("../utils/types");
const config_validation_1 = require("../validation/config.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/getShippingConfig', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        const shippingConfig = await config_controller_1.ConfigController.getShippingConfig();
        return res.status(types_1.StatusCode.SUCCESS_OK).json(shippingConfig);
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
router.post('/updateShippingConfig', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(config_validation_1.UpdateshippingConfigValidation), async (req, res) => {
    try {
        await config_controller_1.ConfigController.updateShippingConfig(req.body);
        return res.status(types_1.StatusCode.SUCCESS_OK).json({ ...req.body });
    }
    catch (error) {
        return error instanceof error_middleware_1.CustomErrorHandler
            ? error
            : new error_middleware_1.CustomErrorHandler(types_1.StatusCode.SERVER_ERROR_INTERNAL, 'internalServerError', 'Internal server error occured please reach to support', error);
    }
});
exports.default = router;
//# sourceMappingURL=config.route.js.map