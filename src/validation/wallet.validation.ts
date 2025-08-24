// *OK*

import joi from 'joi';

export const adminTransactionValidation = joi.object({
  walletId: joi.string().required(),
  type: joi.string().valid('top_up', 'deduction', 'refund').required(),
  amount: joi.number().positive().required(),
  description: joi.string().min(3).required(),
  reference: joi.string().optional(),
  status: joi.string().valid('pending', 'completed', 'failed', 'cancelled').optional(),
});

export const getTransactionHistoryValidation = joi.object({
  page: joi.number().positive().optional(),
  limit: joi.number().positive().optional(),
});

export const updateWalletCurrencyValidation = joi.object({
  currency: joi.string().valid('LYD', 'USD').required(),
});
