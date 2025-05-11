"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const config_model_1 = __importDefault(require("../models/config.model"));
const types_1 = require("../utils/types");
const configId = '65db6c55d3a4d41e6ac96432';
const getShippingConfig = async () => {
    try {
        const res = await config_model_1.default.findById(configId);
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.configUpdateError', 'errorMessageTemp', error);
    }
};
const updateShippingConfig = async (body) => {
    try {
        const res = await config_model_1.default.findOneAndUpdate({ _id: configId }, { ...body });
        return res;
    }
    catch (error) {
        throw new error_middleware_1.CustomErrorHandler(types_1.StatusCode.CLIENT_ERROR_BAD_REQUEST, 'common.configUpdateError', 'errorMessageTemp', error);
    }
};
exports.ConfigController = {
    getShippingConfig,
    updateShippingConfig,
};
//# sourceMappingURL=config.controller.js.map