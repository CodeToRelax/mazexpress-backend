"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const config_model_1 = __importDefault(require("../models/config.model"));
const getShippingConfig = async () => {
    try {
        const res = await config_model_1.default.findById('65db6c55d3a4d41e6ac96432');
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.configUpdateError', 'errorMessageTemp', error);
    }
};
const updateShippingConfig = async (body) => {
    try {
        const res = await config_model_1.default.findOneAndUpdate({ _id: '65db6c55d3a4d41e6ac96432' }, { ...body });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(400, 'common.configUpdateError', 'errorMessageTemp', error);
    }
};
exports.ConfigController = {
    getShippingConfig,
    updateShippingConfig,
};
//# sourceMappingURL=config.controller.js.map