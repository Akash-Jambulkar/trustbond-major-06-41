// Import from correct path
import { getTransactions, clearTransactionHistory } from "./transactions/query";
import { updateTransactionStatus } from "./transactions/status";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { Transaction, TransactionType, createTransactionMetadata } from "./types";

/**
 * Add a transaction to the history
 */
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
    // Convert TransactionMetadata to Json-compatible object
    const txMetadata = createTransactionMetadata(transaction);

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
        metadata: txMetadata
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

/**
 * Listen for transaction confirmation
 */
export const watchTransaction = async (
  web3: any,
  txHash: string,
  account: string
): Promise<void> => {
  try {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    
    if (receipt) {
      // Transaction confirmed
      const { updateTransactionStatus } = await import('./status');
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
