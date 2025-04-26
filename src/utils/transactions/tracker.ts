
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  console.log("Starting transaction tracking:", {
    hash,
    type,
    description,
    account,
    metadata
  });

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
    
    if (!userId) {
      console.error("No user ID found for transaction tracking");
      throw new Error("User not authenticated");
    }
    
    // Extract fee amount if present in metadata
    const amount = metadata?.fee || metadata?.amount || 0;
    console.log(`Transaction amount: ${amount}`);

    // Store transaction in database
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        transaction_hash: transaction.hash,
        type: transaction.type,
        from_address: transaction.account.toLowerCase(),
        to_address: metadata?.toAddress || "",
        status: 'pending',
        amount: amount,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        value: metadata?.amount ? metadata.amount.toString() : amount.toString()
      })
      .select();
    
    if (error) {
      console.error("Error storing transaction:", error);
      throw error;
    }
    
    console.log("Transaction stored successfully:", data);
    
    // Show toast notification
    toast.success(`Transaction submitted: ${description}`, {
      description: `Hash: ${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`,
      duration: 5000
    });
  } catch (err) {
    console.error("Failed to store transaction:", err);
    toast.error("Failed to track transaction. Please try again.");
  }
  
  return transaction;
};

/**
 * Watch for transaction confirmation
 */
export const watchTransaction = async (
  web3: any,
  txHash: string,
  account: string
): Promise<void> => {
  console.log("Starting transaction watch:", {
    txHash,
    account
  });

  try {
    // Poll for transaction receipt
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    
    if (receipt) {
      // Get user ID from session
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user?.id;
      
      if (!userId) {
        console.error("No user ID found for transaction update");
        throw new Error("User not authenticated");
      }

      // Transaction confirmed in blockchain
      const status = receipt.status ? 'confirmed' : 'failed';
      
      console.log("Transaction confirmed:", {
        txHash,
        status,
        blockNumber: receipt.blockNumber
      });
      
      // Update transaction in database
      const { data, error } = await supabase
        .from('transactions')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('transaction_hash', txHash.toLowerCase())
        .eq('from_address', account.toLowerCase())
        .select();
      
      if (error) {
        console.error("Error updating transaction status:", error);
        throw error;
      }
      
      console.log("Transaction status updated:", data);
      
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
    toast.error("Error tracking transaction status");
  }
};
