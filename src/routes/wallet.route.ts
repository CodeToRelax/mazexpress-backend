import { WalletController } from '@/controllers/wallet.controller';
import { CustomErrorHandler } from '@/middlewares/error.middleware';
import AuthenticateFbJWT from '@/middlewares/jwt.middleware';
import { CheckUserRules } from '@/middlewares/checkUserRules.middleware';
import { ValidateRequest } from '@/middlewares/validateRequest.middleware';
import { CustomExpressRequest, StatusCode } from '@/utils/types';
import { topUpWalletValidation, updateWalletCurrencyValidation } from '@/validation/wallet.validation';
import { Router } from 'express';

const router = Router({
  caseSensitive: true,
});

// User routes - require authentication and user rules
router.get('/balance', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    const balance = await WalletController.getWalletBalance(req.user?.mongoId as string);
    return res.status(StatusCode.SUCCESS_OK).json({ balance });
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

router.get('/details', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    const wallet = await WalletController.getWallet(req.user?.mongoId as string);
    if (!wallet) {
      throw new CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
    }
    return res.status(StatusCode.SUCCESS_OK).json(wallet);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

router.get('/transactions', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    const { page, limit } = req.query;
    const paginationOptions = {
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 10,
    };
    const transactions = await WalletController.getTransactionHistory(req.user?.mongoId as string, paginationOptions);
    return res.status(StatusCode.SUCCESS_OK).json(transactions);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

router.get(
  '/transaction/:transactionNumber',
  AuthenticateFbJWT,
  CheckUserRules,
  async (req: CustomExpressRequest, res) => {
    try {
      if (!req.params.transactionNumber) {
        throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
      }
      const transaction = await WalletController.getTransaction(req.params.transactionNumber);
      if (!transaction) {
        throw new CustomErrorHandler(404, 'common.transactionNotFound', 'Transaction not found');
      }
      return res.status(StatusCode.SUCCESS_OK).json(transaction);
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw error;
      } else {
        throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
      }
    }
  }
);

// Admin-only top-up route - requires validation
router.post(
  '/admin/topup',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(topUpWalletValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      if (!req.body.walletId) {
        throw new CustomErrorHandler(403, 'common.errorValidation', 'Wallet ID is required');
      }

      const result = await WalletController.adminTopUpWallet(
        req.body.walletId,
        req.body.amount,
        req.body.description,
        req.body.reference
      );
      return res.status(StatusCode.SUCCESS_CREATED).json(result);
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw error;
      } else {
        throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
      }
    }
  }
);

// Admin routes - require authentication and admin rules
router.get('/admin/all', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    const { page, limit, ...filters } = req.query;
    const paginationOptions = {
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 10,
    };
    const wallets = await WalletController.getAllWallets(paginationOptions, filters);
    return res.status(StatusCode.SUCCESS_OK).json(wallets);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

router.get('/admin/user/:userId', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    if (!req.params.userId) {
      throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    }
    const wallet = await WalletController.getWalletByUserId(req.params.userId);
    if (!wallet) {
      throw new CustomErrorHandler(404, 'common.walletNotFound', 'Wallet not found');
    }
    return res.status(StatusCode.SUCCESS_OK).json(wallet);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

router.patch('/admin/deactivate/:userId', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    if (!req.params.userId) {
      throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    }
    const result = await WalletController.deactivateWallet(req.params.userId);
    return res.status(StatusCode.SUCCESS_OK).json({ message: result });
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

router.patch('/admin/reactivate/:userId', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    if (!req.params.userId) {
      throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    }
    const result = await WalletController.reactivateWallet(req.params.userId);
    return res.status(StatusCode.SUCCESS_OK).json({ message: result });
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

router.patch(
  '/admin/currency/:userId',
  AuthenticateFbJWT,
  CheckUserRules,
  ValidateRequest(updateWalletCurrencyValidation),
  async (req: CustomExpressRequest, res) => {
    try {
      if (!req.params.userId) {
        throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
      }
      const result = await WalletController.updateWalletCurrency(req.params.userId, req.body.currency);
      return res.status(StatusCode.SUCCESS_OK).json({ message: result });
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw error;
      } else {
        throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
      }
    }
  }
);

// Create wallet for existing user
router.post('/admin/create/:userId', AuthenticateFbJWT, CheckUserRules, async (req: CustomExpressRequest, res) => {
  try {
    if (!req.params.userId) {
      throw new CustomErrorHandler(403, 'common.errorValidation', 'common.missingInfo');
    }
    const currency = req.body.currency || 'LYD';
    const wallet = await WalletController.createWalletForExistingUser(req.params.userId, currency);
    return res.status(StatusCode.SUCCESS_CREATED).json(wallet);
  } catch (error) {
    if (error instanceof CustomErrorHandler) {
      throw error;
    } else {
      throw new CustomErrorHandler(500, 'internalServerError', 'internal server error', error);
    }
  }
});

export default router;
