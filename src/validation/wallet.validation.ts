// *OK*

import joi from 'joi';

export const topUpWalletValidation = joi.object({
  walletId: joi.string().required(),
  amount: joi.number().positive().required(),
  description: joi.string().min(3).required(),
  reference: joi.string().optional(),
});

export const getTransactionHistoryValidation = joi.object({
  page: joi.number().positive().optional(),
  limit: joi.number().positive().optional(),
});

export const updateWalletCurrencyValidation = joi.object({
  currency: joi.string().valid('LYD', 'USD').required(),
});
