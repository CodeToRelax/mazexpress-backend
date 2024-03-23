"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ShipmentsSchema = new mongoose_1.default.Schema({
    isn: {
        type: String,
        required: true,
        lowercase: true,
    },
    esn: {
        type: String,
        required: true,
        lowercase: true,
    },
    csn: {
        type: String,
        required: true,
        lowercase: true,
    },
    size: {
        weight: {
            type: Number,
            lowercase: true,
            required: true,
        },
        height: {
            type: Number,
            lowercase: true,
            required: true,
        },
        width: {
            type: Number,
            lowercase: true,
            required: true,
        },
        length: {
            type: Number,
            lowercase: true,
            required: true,
        },
    },
    shipmentDestination: {
        type: String,
        required: true,
        lowercase: true,
    },
    shippingMethod: {
        type: String,
        required: true,
        lowercase: true,
    },
    extraCosts: {
        type: Number,
        required: true,
        lowercase: true,
    },
    note: {
        type: String,
        required: true,
        lowercase: true,
    },
    status: {
        type: String,
        required: true,
        lowercase: true,
    },
});
const ShipmentsCollection = mongoose_1.default.model('Shipments', exports.ShipmentsSchema);
exports.default = ShipmentsCollection;
//# sourceMappingURL=shipments.model.js.map