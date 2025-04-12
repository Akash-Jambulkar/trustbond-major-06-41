
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BlockchainTransactionType, TransactionMetadata } from "@/types/supabase-extensions";

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
  metadata?: any;
}

// Add a transaction to the history
export const trackTransaction = async (
  hash: string, 
  type: TransactionType, 
  description: string,
  account: string,
  network: string | number,
  metadata?: any
): Promise<Transaction> => {
  const transaction: Transaction = {
    hash,
    timestamp: Date.now(),
    status: 'pending',
    type,
    description,
    account,
    network,
    metadata
  };

  try {
    // Store transaction in Supabase
    const { error } = await supabase
      .from('blockchain_transactions')
      .insert({
        hash: transaction.hash,
        from_address: transaction.account.toLowerCase(),
        to_address: "",  // Optional in our schema
        data_hash: transaction.hash, // Using hash as data_hash since it's required
        gas_price: "0", // Default value, will be updated when transaction is confirmed
        gas_used: "0", // Default value, will be updated when transaction is confirmed
        type: transaction.type,
        timestamp: transaction.timestamp,
        metadata: {
          description: transaction.description,
          status: transaction.status,
          network: String(transaction.network),
          blockNumber: transaction.blockNumber
        } as TransactionMetadata
      });
    
    if (error) {
      console.error("Error storing transaction:", error);
    }
  } catch (err) {
    console.error("Failed to store transaction in database:", err);
  }
  
  // Show toast notification
  toast.success(`Transaction submitted: ${description}`, {
    description: `Hash: ${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`,
    duration: 5000
  });
  
  return transaction;
};

// Update transaction status
export const updateTransactionStatus = async (
  hash: string,
  status: TransactionStatus,
  account: string,
  blockNumber?: number,
  metadata?: any
): Promise<void> => {
  try {
    // First get the existing transaction to access its metadata
    const { data: existingTx, error: fetchError } = await supabase
      .from('blockchain_transactions')
      .select('*')
      .eq('hash', hash.toLowerCase())
      .eq('from_address', account.toLowerCase())
      .single();
    
    if (fetchError) {
      console.error("Error fetching transaction:", fetchError);
      return;
    }
    
    // Create safe typed metadata from existing data
    const existingMetadata = existingTx?.metadata as TransactionMetadata || {} as TransactionMetadata;
    
    // Update the metadata with new information
    const updatedMetadata: TransactionMetadata = {
      ...existingMetadata,
      status: status,
      blockNumber: blockNumber,
      ...(metadata as object || {})
    };
    
    // Update transaction in Supabase
    const { error, data } = await supabase
      .from('blockchain_transactions')
      .update({
        metadata: updatedMetadata
      })
      .eq('hash', hash.toLowerCase())
      .eq('from_address', account.toLowerCase())
      .select()
      .single();
    
    if (error) {
      console.error("Error updating transaction:", error);
      return;
    }
    
    // Safely access metadata
    const txMetadata = data.metadata as TransactionMetadata || {} as TransactionMetadata;
    const description = txMetadata.description || "Transaction";
    
    // Show toast notification based on status
    if (status === 'confirmed') {
      toast.success(`Transaction confirmed: ${description}`, {
        description: `Block: ${blockNumber}`,
        duration: 5000
      });
    } else if (status === 'failed') {
      toast.error(`Transaction failed: ${description}`, {
        description: "Please check blockchain explorer for details",
        duration: 5000
      });
    }
  } catch (err) {
    console.error("Failed to update transaction in database:", err);
  }
};

// Get all transactions for an account
export const getTransactions = async (account: string): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('blockchain_transactions')
      .select('*')
      .eq('from_address', account.toLowerCase())
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
    
    return data.map(tx => {
      // Type-cast the metadata safely
      const txMetadata = tx.metadata as TransactionMetadata || {} as TransactionMetadata;
      
      return {
        hash: tx.hash,
        timestamp: tx.timestamp,
        status: txMetadata.status || 'pending' as TransactionStatus,
        type: tx.type as TransactionType,
        description: txMetadata.description || "",
        account: tx.from_address,
        network: txMetadata.network || "",
        blockNumber: txMetadata.blockNumber,
        metadata: tx.metadata
      };
    });
  } catch (err) {
    console.error("Failed to fetch transactions from database:", err);
    return [];
  }
};

// Clear transaction history (for testing or privacy)
export const clearTransactionHistory = async (account: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blockchain_transactions')
      .delete()
      .eq('from_address', account.toLowerCase());
    
    if (error) {
      console.error("Error clearing transaction history:", error);
    }
  } catch (err) {
    console.error("Failed to clear transaction history:", err);
  }
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
