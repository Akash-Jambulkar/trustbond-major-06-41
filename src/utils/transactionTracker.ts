
// This file is deprecated and will be removed in a future update
// Please import from @/utils/transactions instead

import { 
  Transaction, 
  TransactionStatus, 
  TransactionType,
  trackTransaction,
  updateTransactionStatus,
  watchTransaction,
  getTransactions,
  clearTransactionHistory
} from './transactions';

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
