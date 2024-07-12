"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShipmentsValidation = exports.updateShipmentValidation = exports.createShipmentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createShipmentValidation = joi_1.default.object({
    isn: joi_1.default.string().lowercase(),
    csn: joi_1.default.string().lowercase().required(),
    size: joi_1.default.object({
        weight: joi_1.default.number(),
        height: joi_1.default.number(),
        width: joi_1.default.number(),
        length: joi_1.default.number(),
    }),
    shipmentDestination: joi_1.default.string().valid('benghazi', 'tripoli', 'musrata').required(),
    shippingMethod: joi_1.default.string().valid('air', 'sea').required(),
    extraCosts: joi_1.default.number(),
    note: joi_1.default.string(),
    status: joi_1.default
        .string()
        .valid('recieved at warehouse', 'shipped to destination', 'on hold', 'at sorting facility', 'ready for pick up', 'delivered')
        .required(),
});
exports.updateShipmentValidation = joi_1.default.object({
    isn: joi_1.default.string().lowercase(),
    csn: joi_1.default.string().lowercase().required(),
    size: joi_1.default.object({
        weight: joi_1.default.number().required(),
        height: joi_1.default.number().required(),
        width: joi_1.default.number().required(),
        length: joi_1.default.number().required(),
    }),
    shipmentDestination: joi_1.default.string().valid('benghazi', 'tripoli', 'musrata').required(),
    shippingMethod: joi_1.default.string().valid('air', 'sea').required(),
    extraCosts: joi_1.default.number(),
    note: joi_1.default.string(),
    status: joi_1.default
        .string()
        .valid('recieved at warehouse', 'shipped to destination', 'on hold', 'at sorting facility', 'ready for pick up', 'delivered')
        .required(),
});
exports.updateShipmentsValidation = joi_1.default.object({
    shipmentsId: joi_1.default.array().items(joi_1.default.string()).required(),
    shipmentStatus: joi_1.default
        .string()
        .valid('recieved at warehouse', 'shipped to destination', 'on hold', 'at sorting facility', 'ready for pick up', 'delivered')
        .required(),
});
//# sourceMappingURL=shipments.validation.js.map