
// This file is deprecated and will be removed in a future update
// Please import from @/utils/transactions instead

import { 
  Transaction, 
  TransactionStatus, 
  TransactionType 
} from './transactions/types';

import {
  trackTransaction,
  updateTransactionStatus,
  watchTransaction
} from './transactions/tracker';

import {
  getTransactions,
  clearTransactionHistory
} from './transactions/query';

export type { 
  Transaction, 
  TransactionStatus, 
  TransactionType 
};

export { 
  trackTransaction,
  updateTransactionStatus,
  watchTransaction,
  getTransactions,
  clearTransactionHistory
};
