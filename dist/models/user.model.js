"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
exports.UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
    },
    firstName: {
        type: String,
        required: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 8,
    },
    birthdate: {
        type: String,
        required: true,
    },
    address: {
        street: {
            type: String,
            lowercase: true,
        },
        city: {
            type: String,
            required: true,
            lowercase: true,
        },
        specificDescription: {
            type: String,
            lowercase: true,
        },
        country: {
            type: String,
            lowercase: true,
        },
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'invalid email'],
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        lowercase: true,
    },
    privacyPolicy: {
        usageAgreement: { type: Boolean, required: true },
    },
    userType: {
        type: String,
        required: true,
        lowercase: true,
    },
    uniqueShippingNumber: {
        type: String,
        required: true,
    },
    acl: {
        type: String,
        required: true,
    },
    firebaseId: { type: String, required: true },
    disabled: { type: Boolean, required: true },
});
const UserCollection = mongoose_1.default.model('User', exports.UserSchema);
exports.default = UserCollection;
//# sourceMappingURL=user.model.js.map