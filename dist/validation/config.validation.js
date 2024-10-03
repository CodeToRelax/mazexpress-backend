"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateshippingConfigValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UpdateshippingConfigValidation = joi_1.default.object({
    shippingCost: joi_1.default.number().required(),
    shippingFactor: joi_1.default.number().required(),
    libyanExchangeRate: joi_1.default.number().required(),
    seaShippingPrice: joi_1.default.number().required(),
});
//# sourceMappingURL=config.validation.js.map