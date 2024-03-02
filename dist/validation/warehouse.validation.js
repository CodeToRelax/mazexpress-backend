"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWarehouseValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createWarehouseValidation = joi_1.default.object({
    name: joi_1.default.string().lowercase().min(3).required(),
    address: joi_1.default.object({
        doorNumber: joi_1.default.string().required(),
        buildingNumber: joi_1.default.string().required(),
        street: joi_1.default.string().required(),
        neighborhood: joi_1.default.string().required(),
        district: joi_1.default.string().required(),
        city: joi_1.default.string().valid('benghazi', 'tripoli', 'musrata', 'istanbul').required(),
        country: joi_1.default.string().valid('libya', 'turkey').required(),
        googleMapsUrl: joi_1.default.string().required(),
    }),
    phoneNumber: joi_1.default.string().required(),
    email: joi_1.default.string().email().allow('').lowercase(),
    youtubeUrl: joi_1.default.string().allow('').lowercase(),
    imageUrl: joi_1.default.string().allow('').lowercase(),
});
//# sourceMappingURL=warehouse.validation.js.map