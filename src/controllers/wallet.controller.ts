import { CustomErrorHandler } from '@/middlewares/error.middleware';
import WalletCollection from '@/models/wallet.model';
import WalletTransactionCollection, { TransactionType, TransactionStatus } from '@/models/walletTransaction.model';
import { sanitizeSearchParam } from '@/utils/helpers';
import { PaginateOptions } from 'mongoose';
import UserCollection from '@/models/user.model';

// Generate unique transaction number
const generateTransactionNumber = async (): Promise<string> => {
  const prefix = 'TXN';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  let transactionNumber = `${prefix}${timestamp}${random}`;

  // Ensure uniqueness
  let exists = await WalletTransactionCollection.findOne({ transactionNumber });
  let attempts = 0;

  while (exists && attempts < 10) {
    const newRandom = Math.random().toString(36).substring(2, 6).toUpperCase();
    transactionNumber = `${prefix}${timestamp}${newRandom}`;
    exists = await WalletTransactionCollection.findOne({ transactionNumber });
    attempts++;
  }

  return transactionNumber;
};

interface WalletQuery {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  createdAt?: { $gte?: Date; $lte?: Date };
  [key: string]: unknown;
}

// get user wallet
const getWallet = async (userId: string) => {
  try {
    const wallet = await WalletCollection.findOne({ userId });
    return wallet;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// get wallet balance
const getWalletBalance = async (userId: string) => {
  try {
    const wallet = await WalletCollection.findOne({ userId });
    return wallet?.balance || 0;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// create wallet for user
const createWallet = async (userId: string, currency: 'LYD' | 'USD' = 'LYD') => {
  try {
    // check if wallet already exists
    const existingWallet = await WalletCollection.findOne({ userId });
    if (existingWallet) {
      throw new CustomErrorHandler(409, 'common.walletExists', 'Wallet already exists for this user');
    }

    const wallet = new WalletCollection({
      userId,
      balance: 0,
      currency,
      isActive: true,
    });

    const savedWallet = await wallet.save();
    return savedWallet;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// top up wallet
const topUpWallet = async (userId: string, amount: number, description: string, reference?: string) => {
  try {
    if (amount <= 0) {
      throw new CustomErrorHandler(400, 'common.invalidAmount', 'Amount must be greater than 0');
    }

    const wallet = await WalletCollection.findOne({ userId });
    if (!wallet) {
      throw new CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
    }

    if (!wallet.isActive) {
      throw new CustomErrorHandler(400, 'common.walletInactive', 'Wallet is inactive');
    }

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + amount;

    // update wallet balance
    await WalletCollection.updateOne({ _id: wallet._id }, { balance: balanceAfter });

    // create transaction record
    const transaction = new WalletTransactionCollection({
      walletId: wallet._id,
      userId,
      type: TransactionType.TOP_UP,
      amount,
      balanceBefore,
      balanceAfter,
      description,
      reference,
      status: TransactionStatus.COMPLETED,
    });

    const savedTransaction = await transaction.save();

    return {
      wallet: { ...wallet.toObject(), balance: balanceAfter },
      transaction: savedTransaction,
    };
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// get transaction history
const getTransactionHistory = async (userId: string, paginationOptions?: PaginateOptions) => {
  try {
    const transactions = await WalletTransactionCollection.find({ userId })
      .sort({ createdAt: -1 })
      .skip((paginationOptions?.page || 1) - 1)
      .limit(paginationOptions?.limit || 10);
    return transactions;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// get specific transaction
const getTransaction = async (transactionNumber: string) => {
  try {
    const transaction = await WalletTransactionCollection.findOne({ transactionNumber }).populate(
      'walletId',
      'balance currency'
    );
    return transaction;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// admin: get all wallets with pagination and filters
const getAllWallets = async (paginationOptions: PaginateOptions, filters: Record<string, unknown>) => {
  try {
    let query: WalletQuery = {};

    if (filters.searchParam) {
      const sanitizedSearchParam = sanitizeSearchParam(filters.searchParam as string);
      query = {
        $or: [
          { userId: { $regex: sanitizedSearchParam, $options: 'i' } },
          { currency: { $regex: sanitizedSearchParam, $options: 'i' } },
        ],
      };
    } else {
      query = { ...filters };
    }

    if (filters.from || filters.to) {
      query.createdAt = {};
      if (filters.from) {
        const fromDate = new Date(filters.from as string);
        query.createdAt.$gte = fromDate;
      }
      if (filters.to) {
        const toDate = new Date(filters.to as string);
        query.createdAt.$lte = toDate;
      }
      delete query.from;
      delete query.to;
    }

    const wallets = await WalletCollection.find(query)
      .sort({ createdAt: -1 })
      .skip((paginationOptions?.page || 1) - 1)
      .limit(paginationOptions?.limit || 10);
    return wallets;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// admin: get wallet by user ID
const getWalletByUserId = async (userId: string) => {
  try {
    const wallet = await WalletCollection.findOne({ userId }).populate('userId', 'firstName lastName email');
    return wallet;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// admin: deactivate wallet
const deactivateWallet = async (userId: string) => {
  try {
    const result = await WalletCollection.updateOne({ userId }, { isActive: false });

    if (result.matchedCount === 0) {
      throw new CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
    }

    return `wallet deactivated success`;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// admin: reactivate wallet
const reactivateWallet = async (userId: string) => {
  try {
    const result = await WalletCollection.updateOne({ userId }, { isActive: true });

    if (result.matchedCount === 0) {
      throw new CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
    }

    return `wallet reactivated success`;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// admin: update wallet currency
const updateWalletCurrency = async (userId: string, currency: 'LYD' | 'USD') => {
  try {
    const result = await WalletCollection.updateOne({ userId }, { currency });

    if (result.matchedCount === 0) {
      throw new CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
    }

    return `wallet currency updated success`;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// admin: create wallet for existing user
const createWalletForExistingUser = async (userId: string, currency: 'LYD' | 'USD' = 'LYD') => {
  try {
    // check if user exists
    const user = await UserCollection.findById(userId);
    if (!user) {
      throw new CustomErrorHandler(404, 'common.userNotFound', 'User not found');
    }

    // check if wallet already exists
    const existingWallet = await WalletCollection.findOne({ userId });
    if (existingWallet) {
      throw new CustomErrorHandler(409, 'common.walletExists', 'Wallet already exists for this user');
    }

    const wallet = new WalletCollection({
      userId,
      balance: 0,
      currency,
      isActive: true,
    });

    const savedWallet = await wallet.save();
    return savedWallet;
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

// admin: process wallet transaction (top-up, deduction, refund)
const adminProcessWalletTransaction = async (
  walletId: string,
  type: 'top_up' | 'deduction' | 'refund',
  amount: number,
  description: string,
  reference?: string,
  status: 'pending' | 'completed' | 'failed' | 'cancelled' = 'completed'
) => {
  try {
    if (amount <= 0) {
      throw new CustomErrorHandler(400, 'common.invalidAmount', 'Amount must be greater than 0');
    }

    const wallet = await WalletCollection.findById(walletId);
    if (!wallet) {
      throw new CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
    }

    if (!wallet.isActive) {
      throw new CustomErrorHandler(400, 'common.walletInactive', 'Wallet is inactive');
    }

    const balanceBefore = wallet.balance;
    let balanceAfter: number;

    // Only update balance if status is 'completed'
    if (status === 'completed') {
      // Calculate new balance based on transaction type
      if (type === 'deduction') {
        balanceAfter = balanceBefore - amount;
        // Check if deduction would result in negative balance (optional - you can remove this if you allow negative balances)
        if (balanceAfter < 0) {
          throw new CustomErrorHandler(400, 'common.insufficientBalance', 'Insufficient balance for deduction');
        }
      } else {
        // top_up and refund both add to balance
        balanceAfter = balanceBefore + amount;
      }

      // update wallet balance
      await WalletCollection.updateOne({ _id: wallet._id }, { balance: balanceAfter });
    } else {
      // For non-completed statuses, keep the same balance
      balanceAfter = balanceBefore;
    }

    // create transaction record
    const transactionNumber = await generateTransactionNumber();
    const transaction = new WalletTransactionCollection({
      transactionNumber,
      walletId: wallet._id,
      userId: wallet.userId,
      type: type as TransactionType,
      amount,
      balanceBefore,
      balanceAfter,
      description,
      reference,
      status: status as TransactionStatus,
    });

    const savedTransaction = await transaction.save();

    return {
      wallet: { ...wallet.toObject(), balance: balanceAfter },
      transaction: savedTransaction,
    };
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(400, 'common.walletError', 'errorMessageTemp', error);
    }
  }
};

export const WalletController = {
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
