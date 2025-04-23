
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Transaction, TransactionType, createTransactionMetadata } from "./types";
import { useAuth } from "@/contexts/AuthContext";

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
    // Get user ID from session
    const { data: authData } = await supabase.auth.getSession();
    const userId = authData.session?.user?.id;
    
    // Store transaction in database
    const { error } = await supabase
      .from('transactions')
      .insert({
        transaction_hash: transaction.hash,
        type: transaction.type,
        from_address: transaction.account.toLowerCase(),
        to_address: metadata?.toAddress || "",
        status: 'pending',
        amount: metadata?.amount || 0,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
    // Poll for transaction receipt
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    
    if (receipt) {
      // Get user ID from session
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user?.id;
      
      // Transaction confirmed in blockchain
      const status = receipt.status ? 'confirmed' : 'failed';
      
      // Update transaction in database
      const { error } = await supabase
        .from('transactions')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('transaction_hash', txHash.toLowerCase())
        .eq('from_address', account.toLowerCase());
      
      if (error) {
        console.error("Error updating transaction status:", error);
      }
      
      // Show notification
      if (status === 'confirmed') {
        toast.success(`Transaction confirmed`, {
          description: `Block: ${receipt.blockNumber}`,
          duration: 5000
        });
      } else {
        toast.error(`Transaction failed`, {
          description: `Please try again`,
          duration: 5000
        });
      }
    } else {
      // Check again in 3 seconds
      setTimeout(() => watchTransaction(web3, txHash, account), 3000);
    }
  } catch (error) {
    console.error("Error watching transaction:", error);
  }
};
