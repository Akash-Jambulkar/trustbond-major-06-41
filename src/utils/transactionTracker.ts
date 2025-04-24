
// Import from correct paths
import { getTransactions, clearTransactionHistory } from "./transactions/query";
import { trackTransaction, watchTransaction } from "./transactions/tracker";
import { updateTransactionStatus } from "./transactions/status";
import type { TransactionStatus, TransactionType, Transaction } from "./transactions/types";

// Export all transaction-related functions together
export { 
  getTransactions, 
  clearTransactionHistory, 
  trackTransaction, 
  watchTransaction, 
  updateTransactionStatus
};

// Re-export types for easy access
export type { 
  TransactionStatus, 
  TransactionType,
  Transaction
};
