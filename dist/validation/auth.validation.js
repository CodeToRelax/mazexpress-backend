"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserValidation = exports.createUserValidation = exports.signupValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupValidation = joi_1.default.object({
    firstName: joi_1.default.string().lowercase().min(3).required(),
    lastName: joi_1.default.string().lowercase().min(3).required(),
    password: joi_1.default.string().min(3).required(),
    confirmPassword: joi_1.default.ref('password'),
    birthdate: joi_1.default.string().allow('').lowercase(),
    address: joi_1.default.object({
        street: joi_1.default.string().required(),
        city: joi_1.default.string().valid('benghazi', 'tripoli', 'musrata', 'istanbul').required(),
        specificDescription: joi_1.default.string().optional(),
        country: joi_1.default.string().valid('libya', 'turkey').required(),
    }),
    gender: joi_1.default.string().valid('male', 'female').required(),
    email: joi_1.default.string().email().allow('').lowercase(),
    phoneNumber: joi_1.default.string().required(),
    privacyPolicy: joi_1.default.object({
        usageAgreement: joi_1.default.boolean().required(),
    }),
});
exports.createUserValidation = joi_1.default.object({
    firstName: joi_1.default.string().lowercase().min(3).required(),
    lastName: joi_1.default.string().lowercase().min(3).required(),
    password: joi_1.default.string().min(3).required(),
    confirmPassword: joi_1.default.ref('password'),
    birthdate: joi_1.default.string().allow('').lowercase(),
    address: joi_1.default.object({
        street: joi_1.default.string().required(),
        city: joi_1.default.string().valid('benghazi', 'tripoli', 'musrata', 'istanbul').required(),
        specificDescription: joi_1.default.string().optional(),
        country: joi_1.default.string().valid('libya', 'turkey').required(),
    }),
    gender: joi_1.default.string().valid('male', 'female').required(),
    email: joi_1.default.string().email().allow('').lowercase(),
    phoneNumber: joi_1.default.string().required(),
    privacyPolicy: joi_1.default.object({
        usageAgreement: joi_1.default.boolean().required(),
    }),
    userType: joi_1.default.string().valid('admin', 'customer').required(),
});
exports.toggleUserValidation = joi_1.default.object({
    firebaseId: joi_1.default.string().required(),
    status: joi_1.default.string().valid('enable', 'disable').required(),
});
//# sourceMappingURL=auth.validation.js.map