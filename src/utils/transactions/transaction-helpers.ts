
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Web3 from "web3";

/**
 * Store transaction in the database
 */
export const storeTransaction = async (
  hash: string,
  type: string,
  fromAddress: string,
  userId?: string,
  amount?: string,
  toAddress?: string
): Promise<boolean> => {
  try {
    // Get user ID from session if not provided
    if (!userId) {
      const { data } = await supabase.auth.getSession();
      userId = data.session?.user?.id;
      
      if (!userId) {
        console.error("No user ID available for transaction");
        return false;
      }
    }
    
    // Store transaction in Supabase
    const { error } = await supabase.from('transactions').insert({
      transaction_hash: hash,
      type: type,
      from_address: fromAddress,
      to_address: toAddress || null,
      amount: amount ? parseFloat(amount) : null,
      status: 'pending',
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    if (error) {
      console.error("Error storing transaction:", error);
      return false;
    }
    
    console.log(`Transaction ${hash} stored successfully`);
    return true;
  } catch (error) {
    console.error("Error storing transaction:", error);
    return false;
  }
};

/**
 * Watch transaction for confirmation status
 */
export const watchTransactionStatus = async (
  web3: Web3,
  txHash: string,
  userId?: string
): Promise<void> => {
  try {
    console.log(`Watching transaction ${txHash} for status updates`);
    
    // Poll for transaction receipt
    const checkReceipt = async () => {
      try {
        const receipt = await web3.eth.getTransactionReceipt(txHash);
        
        if (receipt) {
          // Transaction confirmed
          const status = receipt.status ? 'confirmed' : 'failed';
          
          // Update transaction in database
          const { error } = await supabase
            .from('transactions')
            .update({
              status,
              updated_at: new Date().toISOString()
            })
            .eq('transaction_hash', txHash);
          
          if (error) {
            console.error("Error updating transaction status:", error);
          } else {
            console.log(`Transaction ${txHash} updated to ${status}`);
            
            // Show notification
            if (status === 'confirmed') {
              toast.success("Transaction confirmed", {
                description: `Block: ${receipt.blockNumber}`,
                duration: 5000
              });
            } else {
              toast.error("Transaction failed", {
                description: "Please try again",
                duration: 5000
              });
            }
          }
        } else {
          // Check again in 3 seconds
          setTimeout(checkReceipt, 3000);
        }
      } catch (error) {
        console.error("Error checking transaction receipt:", error);
        setTimeout(checkReceipt, 5000); // Retry with longer delay on error
      }
    };
    
    // Start checking
    checkReceipt();
  } catch (error) {
    console.error("Error watching transaction:", error);
  }
};

/**
 * Get all transactions for a user
 */
export const getUserTransactions = async (userId?: string, limit = 10): Promise<any[]> => {
  try {
    if (!userId) {
      const { data } = await supabase.auth.getSession();
      userId = data.session?.user?.id;
      
      if (!userId) {
        return [];
      }
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};
