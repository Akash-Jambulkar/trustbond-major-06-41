
import { toast } from "sonner";

// Transaction types
export type TransactionType = 'kyc' | 'loan' | 'verification' | 'registration' | 'other';

// Transaction status
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

// Transaction object
export interface Transaction {
  hash: string;
  timestamp: number;
  status: TransactionStatus;
  type: TransactionType;
  description: string;
  account: string;
  network: string | number;
  blockNumber?: number;
  metadata?: any; // Added metadata property
}

// Add a transaction to the history
export const trackTransaction = (
  hash: string, 
  type: TransactionType, 
  description: string,
  account: string,
  network: string | number,
  metadata?: any // Added optional metadata parameter
): Transaction => {
  const transaction: Transaction = {
    hash,
    timestamp: Date.now(),
    status: 'pending',
    type,
    description,
    account,
    network,
    metadata // Include metadata in transaction
  };

  // Get existing transactions for this account
  const existingJson = localStorage.getItem(`transactions_${account.toLowerCase()}`);
  const existing = existingJson ? JSON.parse(existingJson) : [];
  
  // Add new transaction at the beginning
  const updated = [transaction, ...existing];
  
  // Store in local storage
  localStorage.setItem(`transactions_${account.toLowerCase()}`, JSON.stringify(updated));
  
  // Show toast notification
  toast.success(`Transaction submitted: ${description}`, {
    description: `Hash: ${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`,
    duration: 5000
  });
  
  return transaction;
};

// Update transaction status
export const updateTransactionStatus = (
  hash: string,
  status: TransactionStatus,
  account: string,
  blockNumber?: number,
  metadata?: any // Added optional metadata parameter
): void => {
  // Get existing transactions
  const existingJson = localStorage.getItem(`transactions_${account.toLowerCase()}`);
  if (!existingJson) return;
  
  const transactions: Transaction[] = JSON.parse(existingJson);
  
  // Find and update the transaction
  const updatedTransactions = transactions.map(tx => {
    if (tx.hash.toLowerCase() === hash.toLowerCase()) {
      return {
        ...tx,
        status,
        blockNumber,
        metadata: metadata || tx.metadata // Update metadata if provided
      };
    }
    return tx;
  });
  
  // Store updated transactions
  localStorage.setItem(`transactions_${account.toLowerCase()}`, JSON.stringify(updatedTransactions));
  
  // Show toast notification based on status
  const tx = updatedTransactions.find(t => t.hash.toLowerCase() === hash.toLowerCase());
  
  if (tx) {
    if (status === 'confirmed') {
      toast.success(`Transaction confirmed: ${tx.description}`, {
        description: `Block: ${blockNumber}`,
        duration: 5000
      });
    } else if (status === 'failed') {
      toast.error(`Transaction failed: ${tx.description}`, {
        description: "Please check blockchain explorer for details",
        duration: 5000
      });
    }
  }
};

// Clear transaction history (for testing or privacy)
export const clearTransactionHistory = (account: string): void => {
  localStorage.removeItem(`transactions_${account.toLowerCase()}`);
};

// Get all transactions for an account
export const getTransactions = (account: string): Transaction[] => {
  const existingJson = localStorage.getItem(`transactions_${account.toLowerCase()}`);
  return existingJson ? JSON.parse(existingJson) : [];
};

// Listen for transaction confirmation
export const watchTransaction = async (
  web3: any,
  txHash: string,
  account: string
): Promise<void> => {
  try {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    
    if (receipt) {
      // Transaction confirmed
      updateTransactionStatus(
        txHash,
        receipt.status ? 'confirmed' : 'failed',
        account,
        receipt.blockNumber
      );
    } else {
      // Check again in 3 seconds
      setTimeout(() => watchTransaction(web3, txHash, account), 3000);
    }
  } catch (error) {
    console.error("Error watching transaction:", error);
  }
};
