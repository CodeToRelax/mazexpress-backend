"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAmount = exports.formatCurrency = exports.generateTransactionNumber = void 0;
const walletTransaction_model_1 = __importDefault(require("../models/walletTransaction.model"));
const generateTransactionNumber = async () => {
    const prefix = 'TXN';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    let transactionNumber = `${prefix}${timestamp}${random}`;
    let exists = await walletTransaction_model_1.default.findOne({ transactionNumber });
    let attempts = 0;
    while (exists && attempts < 10) {
        const newRandom = Math.random().toString(36).substring(2, 6).toUpperCase();
        transactionNumber = `${prefix}${timestamp}${newRandom}`;
        exists = await walletTransaction_model_1.default.findOne({ transactionNumber });
        attempts++;
    }
    return transactionNumber;
};
exports.generateTransactionNumber = generateTransactionNumber;
const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
const validateAmount = (amount) => {
    return typeof amount === 'number' && !isNaN(amount) && isFinite(amount);
};
exports.validateAmount = validateAmount;
//# sourceMappingURL=wallet.helpers.js.map