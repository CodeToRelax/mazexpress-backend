"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletCurrencyValidation = exports.getTransactionHistoryValidation = exports.topUpWalletValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.topUpWalletValidation = joi_1.default.object({
    walletId: joi_1.default.string().required(),
    amount: joi_1.default.number().positive().required(),
    description: joi_1.default.string().min(3).required(),
    reference: joi_1.default.string().optional(),
});
exports.getTransactionHistoryValidation = joi_1.default.object({
    page: joi_1.default.number().positive().optional(),
    limit: joi_1.default.number().positive().optional(),
});
exports.updateWalletCurrencyValidation = joi_1.default.object({
    currency: joi_1.default.string().valid('LYD', 'USD').required(),
});
//# sourceMappingURL=wallet.validation.js.map