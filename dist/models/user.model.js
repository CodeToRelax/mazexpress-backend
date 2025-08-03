"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const types_1 = require("../utils/types");
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const helpers_1 = require("../utils/helpers");
exports.UserSchema = new mongoose_1.default.Schema({
    firebaseId: { type: String, required: true },
    disabled: { type: Boolean, required: true },
    acl: {
        type: Object,
        required: true,
    },
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
    birthdate: {
        type: String,
        required: true,
    },
    address: {
        street: {
            type: String,
            lowercase: true,
        },
        specificDescription: {
            type: String,
            lowercase: true,
            required: false,
        },
        city: {
            type: String,
            required: true,
            lowercase: true,
            enum: types_1.Cities,
            default: types_1.Cities.BENGHAZI,
        },
        country: {
            type: String,
            lowercase: true,
            enum: types_1.Countries,
            default: types_1.Countries.LIBYA,
        },
    },
    gender: {
        type: String,
        lowercase: true,
        required: true,
        enum: types_1.Gender,
        default: types_1.Gender.MALE,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'Invalid email address used'],
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        lowercase: true,
        validate: [helpers_1.validateLibyanNumber, 'Invalid phone number used.'],
    },
    userType: {
        type: String,
        required: true,
        lowercase: true,
        enum: types_1.UserTypes,
        default: types_1.UserTypes.CUSTOMER,
    },
    uniqueShippingNumber: {
        type: String,
        required: true,
    },
    privacyPolicy: {
        usageAgreement: { type: Boolean, required: true },
    },
}, {
    timestamps: true,
});
exports.UserSchema.plugin(mongoose_paginate_v2_1.default);
const UserCollection = mongoose_1.default.model('User', exports.UserSchema, 'user');
exports.default = UserCollection;
//# sourceMappingURL=user.model.js.map