"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
exports.WarehouseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    address: {
        doorNumber: {
            type: String,
            lowercase: true,
        },
        buildingNumber: {
            type: String,
            lowercase: true,
        },
        street: {
            type: String,
            lowercase: true,
        },
        neighborhood: {
            type: String,
            lowercase: true,
        },
        district: {
            type: String,
            lowercase: true,
        },
        city: {
            type: String,
            required: true,
            lowercase: true,
        },
        country: {
            type: String,
            required: true,
            lowercase: true,
        },
        googleMapsUrl: {
            type: String,
            required: true,
        },
    },
    phoneNumber: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'invalid email'],
    },
    youtubeUrl: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: false,
    },
});
const WarehouseCollection = mongoose_1.default.model('Warehouse', exports.WarehouseSchema);
exports.default = WarehouseCollection;
//# sourceMappingURL=warehouse.model.js.map