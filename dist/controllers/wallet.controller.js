"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const wallet_model_1 = __importDefault(require("../models/wallet.model"));
const walletTransaction_model_1 = __importStar(require("../models/walletTransaction.model"));
const helpers_1 = require("../utils/helpers");
const user_model_1 = __importDefault(require("../models/user.model"));
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
const getWallet = async (userId) => {
    try {
        const wallet = await wallet_model_1.default.findOne({ userId });
        return wallet;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const getWalletBalance = async (userId) => {
    try {
        const wallet = await wallet_model_1.default.findOne({ userId });
        return wallet?.balance || 0;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const createWallet = async (userId, currency = 'LYD') => {
    try {
        const existingWallet = await wallet_model_1.default.findOne({ userId });
        if (existingWallet) {
            throw new error_middleware_1.CustomErrorHandler(409, 'common.walletExists', 'Wallet already exists for this user');
        }
        const wallet = new wallet_model_1.default({
            userId,
            balance: 0,
            currency,
            isActive: true,
        });
        const savedWallet = await wallet.save();
        return savedWallet;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const topUpWallet = async (userId, amount, description, reference) => {
    try {
        if (amount <= 0) {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.invalidAmount', 'Amount must be greater than 0');
        }
        const wallet = await wallet_model_1.default.findOne({ userId });
        if (!wallet) {
            throw new error_middleware_1.CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
        }
        if (!wallet.isActive) {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletInactive', 'Wallet is inactive');
        }
        const balanceBefore = wallet.balance;
        const balanceAfter = balanceBefore + amount;
        await wallet_model_1.default.updateOne({ _id: wallet._id }, { balance: balanceAfter });
        const transaction = new walletTransaction_model_1.default({
            walletId: wallet._id,
            userId,
            type: walletTransaction_model_1.TransactionType.TOP_UP,
            amount,
            balanceBefore,
            balanceAfter,
            description,
            reference,
            status: walletTransaction_model_1.TransactionStatus.COMPLETED,
        });
        const savedTransaction = await transaction.save();
        return {
            wallet: { ...wallet.toObject(), balance: balanceAfter },
            transaction: savedTransaction,
        };
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const getTransactionHistory = async (userId, paginationOptions) => {
    try {
        const transactions = await walletTransaction_model_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .skip((paginationOptions?.page || 1) - 1)
            .limit(paginationOptions?.limit || 10);
        return transactions;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const getTransaction = async (transactionNumber) => {
    try {
        const transaction = await walletTransaction_model_1.default.findOne({ transactionNumber }).populate('walletId', 'balance currency');
        return transaction;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const getAllWallets = async (paginationOptions, filters) => {
    try {
        let query = {};
        if (filters.searchParam) {
            const sanitizedSearchParam = (0, helpers_1.sanitizeSearchParam)(filters.searchParam);
            query = {
                $or: [
                    { userId: { $regex: sanitizedSearchParam, $options: 'i' } },
                    { currency: { $regex: sanitizedSearchParam, $options: 'i' } },
                ],
            };
        }
        else {
            query = { ...filters };
        }
        if (filters.from || filters.to) {
            query.createdAt = {};
            if (filters.from) {
                const fromDate = new Date(filters.from);
                query.createdAt.$gte = fromDate;
            }
            if (filters.to) {
                const toDate = new Date(filters.to);
                query.createdAt.$lte = toDate;
            }
            delete query.from;
            delete query.to;
        }
        const wallets = await wallet_model_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip((paginationOptions?.page || 1) - 1)
            .limit(paginationOptions?.limit || 10);
        return wallets;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const getWalletByUserId = async (userId) => {
    try {
        const wallet = await wallet_model_1.default.findOne({ userId }).populate('userId', 'firstName lastName email');
        return wallet;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const deactivateWallet = async (userId) => {
    try {
        const result = await wallet_model_1.default.updateOne({ userId }, { isActive: false });
        if (result.matchedCount === 0) {
            throw new error_middleware_1.CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
        }
        return `wallet deactivated success`;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const reactivateWallet = async (userId) => {
    try {
        const result = await wallet_model_1.default.updateOne({ userId }, { isActive: true });
        if (result.matchedCount === 0) {
            throw new error_middleware_1.CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
        }
        return `wallet reactivated success`;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const updateWalletCurrency = async (userId, currency) => {
    try {
        const result = await wallet_model_1.default.updateOne({ userId }, { currency });
        if (result.matchedCount === 0) {
            throw new error_middleware_1.CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
        }
        return `wallet currency updated success`;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const createWalletForExistingUser = async (userId, currency = 'LYD') => {
    try {
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new error_middleware_1.CustomErrorHandler(404, 'common.userNotFound', 'User not found');
        }
        const existingWallet = await wallet_model_1.default.findOne({ userId });
        if (existingWallet) {
            throw new error_middleware_1.CustomErrorHandler(409, 'common.walletExists', 'Wallet already exists for this user');
        }
        const wallet = new wallet_model_1.default({
            userId,
            balance: 0,
            currency,
            isActive: true,
        });
        const savedWallet = await wallet.save();
        return savedWallet;
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
const adminProcessWalletTransaction = async (walletId, type, amount, description, reference, status = 'completed') => {
    try {
        if (amount <= 0) {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.invalidAmount', 'Amount must be greater than 0');
        }
        const wallet = await wallet_model_1.default.findById(walletId);
        if (!wallet) {
            throw new error_middleware_1.CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
        }
        if (!wallet.isActive) {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletInactive', 'Wallet is inactive');
        }
        const balanceBefore = wallet.balance;
        let balanceAfter;
        if (status === 'completed') {
            if (type === 'deduction') {
                balanceAfter = balanceBefore - amount;
                if (balanceAfter < 0) {
                    throw new error_middleware_1.CustomErrorHandler(400, 'common.insufficientBalance', 'Insufficient balance for deduction');
                }
            }
            else {
                balanceAfter = balanceBefore + amount;
            }
            await wallet_model_1.default.updateOne({ _id: wallet._id }, { balance: balanceAfter });
        }
        else {
            balanceAfter = balanceBefore;
        }
        const transactionNumber = await generateTransactionNumber();
        const transaction = new walletTransaction_model_1.default({
            transactionNumber,
            walletId: wallet._id,
            userId: wallet.userId,
            type: type,
            amount,
            balanceBefore,
            balanceAfter,
            description,
            reference,
            status: status,
        });
        const savedTransaction = await transaction.save();
        return {
            wallet: { ...wallet.toObject(), balance: balanceAfter },
            transaction: savedTransaction,
        };
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
        }
    }
};
exports.WalletController = {
    getWallet,
    getWalletBalance,
    createWallet,
    createWalletForExistingUser,
    topUpWallet,
    adminProcessWalletTransaction,
    getTransactionHistory,
    getTransaction,
    getAllWallets,
    getWalletByUserId,
    deactivateWallet,
    reactivateWallet,
    updateWalletCurrency,
};
//# sourceMappingURL=wallet.controller.js.map