
// Import from correct path
import { getTransactions, clearTransactionHistory } from "./transactions/query";
import { trackTransaction, watchTransaction } from "./transactions/tracker";
import { updateTransactionStatus } from "./transactions/status";
import { TransactionStatus, TransactionType, Transaction } from "./transactions/types";

export { 
  getTransactions, 
  clearTransactionHistory, 
  trackTransaction, 
  watchTransaction, 
  updateTransactionStatus
}

// Use export type for type re-exports
export type { 
  TransactionStatus, 
  TransactionType,
  Transaction
};
