import WalletTransactionCollection from '@/models/walletTransaction.model';

export const generateTransactionNumber = async (): Promise<string> => {
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

export const formatCurrency = (amount: number, currency: 'LYD' | 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const validateAmount = (amount: number): boolean => {
  return typeof amount === 'number' && !isNaN(amount) && isFinite(amount);
};
