"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var TransactionType;
(function (TransactionType) {
    TransactionType["TOP_UP"] = "top_up";
    TransactionType["DEDUCTION"] = "deduction";
    TransactionType["REFUND"] = "refund";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
const WalletTransactionSchema = new mongoose_1.default.Schema({
    transactionNumber: {
        type: String,
        required: true,
        unique: true,
    },
    walletId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(TransactionType),
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    balanceBefore: {
        type: Number,
        required: true,
    },
    balanceAfter: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reference: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.COMPLETED,
    },
    metadata: {
        type: mongoose_1.default.Schema.Types.Mixed,
        default: {},
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('WalletTransaction', WalletTransactionSchema);
//# sourceMappingURL=walletTransaction.model.js.map