"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAclValidation = exports.toggleUserValidation = exports.createUserValidation = void 0;
const types_1 = require("../utils/types");
const joi_1 = __importDefault(require("joi"));
exports.createUserValidation = joi_1.default.object({
    firstName: joi_1.default.string().lowercase().min(3).required(),
    lastName: joi_1.default.string().lowercase().min(3).required(),
    password: joi_1.default.string().min(3).required(),
    birthdate: joi_1.default.string().allow('').lowercase(),
    address: joi_1.default.object({
        street: joi_1.default.string().required(),
        city: joi_1.default
            .string()
            .valid(...Object.values(types_1.Cities))
            .required(),
        specificDescription: joi_1.default.string().optional(),
        country: joi_1.default
            .string()
            .valid(...Object.values(types_1.Countries))
            .required(),
    }),
    gender: joi_1.default
        .string()
        .valid(...Object.values(types_1.Gender))
        .required(),
    email: joi_1.default.string().email().allow('').lowercase(),
    phoneNumber: joi_1.default.string().required(),
    privacyPolicy: joi_1.default.object({
        usageAgreement: joi_1.default.boolean().required(),
    }),
    userType: joi_1.default
        .string()
        .valid(...Object.values(types_1.UserTypes))
        .optional(),
});
exports.toggleUserValidation = joi_1.default.object({
    firebaseId: joi_1.default.string().required(),
    status: joi_1.default
        .string()
        .valid(...Object.values(types_1.ToggleState))
        .required(),
});
exports.updateAclValidation = joi_1.default.object({
    userId: joi_1.default.string().required(),
    rules: joi_1.default
        .object({
        DELETE: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.any()),
        POST: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.any()),
        PATCH: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.any()),
        GET: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.any()),
    })
        .required(),
});
//# sourceMappingURL=auth.validation.js.map