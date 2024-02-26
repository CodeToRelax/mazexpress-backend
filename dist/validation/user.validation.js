"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserValidation = exports.AdminUpdateUserValidation = exports.UpdateProfileValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UpdateProfileValidation = joi_1.default.object({
    firstName: joi_1.default.string().lowercase().min(3).required(),
    lastName: joi_1.default.string().lowercase().min(3).required(),
    birthdate: joi_1.default.string().allow('').lowercase(),
});
exports.AdminUpdateUserValidation = joi_1.default.object({
    firstName: joi_1.default.string().lowercase().min(3).required(),
    lastName: joi_1.default.string().lowercase().min(3).required(),
    birthdate: joi_1.default.string().allow('').lowercase(),
    address: joi_1.default.object({
        street: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        specificDescription: joi_1.default.string().optional(),
    }),
    phoneNumber: joi_1.default.number().required(),
});
exports.deleteUserValidation = joi_1.default.object({
    mongoId: joi_1.default.string().required(),
    firebaseId: joi_1.default.string().required(),
});
//# sourceMappingURL=user.validation.js.map