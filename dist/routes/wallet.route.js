"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_controller_1 = require("../controllers/wallet.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
const jwt_middleware_1 = __importDefault(require("../middlewares/jwt.middleware"));
const checkUserRules_middleware_1 = require("../middlewares/checkUserRules.middleware");
const validateRequest_middleware_1 = require("../middlewares/validateRequest.middleware");
const types_1 = require("../utils/types");
const wallet_validation_1 = require("../validation/wallet.validation");
const express_1 = require("express");
const router = (0, express_1.Router)({
    caseSensitive: true,
});
router.get('/balance', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        const balance = await wallet_controller_1.WalletController.getWalletBalance(req.user?.mongoId);
        return res.status(types_1.StatusCode.SUCCESS_OK).json({ balance });
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.get('/details', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        const wallet = await wallet_controller_1.WalletController.getWallet(req.user?.mongoId);
        if (!wallet) {
            throw new error_middleware_1.CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
        }
        return res.status(types_1.StatusCode.SUCCESS_OK).json(wallet);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.get('/transactions', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        const { page, limit } = req.query;
        const paginationOptions = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
        };
        const transactions = await wallet_controller_1.WalletController.getTransactionHistory(req.user?.mongoId, paginationOptions);
        return res.status(types_1.StatusCode.SUCCESS_OK).json(transactions);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.get('/transaction/:transactionNumber', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        if (!req.params.transactionNumber) {
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
        }
        const transaction = await wallet_controller_1.WalletController.getTransaction(req.params.transactionNumber);
        if (!transaction) {
            throw new error_middleware_1.CustomErrorHandler(404, 'common.transactionNotFound', 'Transaction not found');
        }
        return res.status(types_1.StatusCode.SUCCESS_OK).json(transaction);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.post('/admin/transaction', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(wallet_validation_1.adminTransactionValidation), async (req, res) => {
    try {
        if (!req.body.walletId) {
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'Wallet ID is required');
        }
        if (!req.body.type) {
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'Transaction type is required');
        }
        const result = await wallet_controller_1.WalletController.adminProcessWalletTransaction(req.body.walletId, req.body.type, req.body.amount, req.body.description, req.body.reference, req.body.status || 'completed');
        return res.status(types_1.StatusCode.SUCCESS_CREATED).json(result);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.get('/admin/all', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        const { page, limit, ...filters } = req.query;
        const paginationOptions = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
        };
        const wallets = await wallet_controller_1.WalletController.getAllWallets(paginationOptions, filters);
        return res.status(types_1.StatusCode.SUCCESS_OK).json(wallets);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.get('/admin/user/:userId', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        if (!req.params.userId) {
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
        }
        const wallet = await wallet_controller_1.WalletController.getWalletByUserId(req.params.userId);
        if (!wallet) {
            throw new error_middleware_1.CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
        }
        return res.status(types_1.StatusCode.SUCCESS_OK).json(wallet);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.patch('/admin/deactivate/:userId', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        if (!req.params.userId) {
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
        }
        const result = await wallet_controller_1.WalletController.deactivateWallet(req.params.userId);
        return res.status(types_1.StatusCode.SUCCESS_OK).json({ message: result });
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.patch('/admin/reactivate/:userId', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        if (!req.params.userId) {
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
        }
        const result = await wallet_controller_1.WalletController.reactivateWallet(req.params.userId);
        return res.status(types_1.StatusCode.SUCCESS_OK).json({ message: result });
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.patch('/admin/currency/:userId', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, (0, validateRequest_middleware_1.ValidateRequest)(wallet_validation_1.updateWalletCurrencyValidation), async (req, res) => {
    try {
        if (!req.params.userId) {
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
        }
        const result = await wallet_controller_1.WalletController.updateWalletCurrency(req.params.userId, req.body.currency);
        return res.status(types_1.StatusCode.SUCCESS_OK).json({ message: result });
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
router.post('/admin/create/:userId', jwt_middleware_1.default, checkUserRules_middleware_1.CheckUserRules, async (req, res) => {
    try {
        if (!req.params.userId) {
            throw new error_middleware_1.CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
        }
        const currency = req.body.currency || 'LYD';
        const wallet = await wallet_controller_1.WalletController.createWalletForExistingUser(req.params.userId, currency);
        return res.status(types_1.StatusCode.SUCCESS_CREATED).json(wallet);
    }
    catch (error) {
        if (error instanceof error_middleware_1.CustomErrorHandler) {
            throw error;
        }
        else {
            throw new error_middleware_1.CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
        }
    }
});
exports.default = router;
//# sourceMappingURL=wallet.route.js.map