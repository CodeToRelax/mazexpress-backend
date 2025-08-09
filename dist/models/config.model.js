"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ConfigSchema = new mongoose_1.default.Schema({
    shippingCost: {
        type: Number,
        required: true,
        unique: true,
    },
    shippingFactorSea: {
        type: Number,
        required: true,
        unique: true,
    },
    shippingFactor: {
        type: Number,
        required: true,
        unique: true,
    },
    libyanExchangeRate: {
        type: Number,
        required: true,
        unique: true,
    },
    seaShippingPrice: {
        type: Number,
        required: true,
        unique: true,
    },
});
const ConfigCollection = mongoose_1.default.model('Config', exports.ConfigSchema);
exports.default = ConfigCollection;
//# sourceMappingURL=config.model.js.map