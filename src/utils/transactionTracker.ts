
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export interface TransactionData {
  transaction_hash: string;
  type: string;
  description: string;
  from_address?: string;
  to_address?: string;
  amount?: number;
  status?: 'pending' | 'confirmed' | 'failed';
  metadata?: any;
  user_id?: string;
  bank_id?: string;
}

/**
 * Track a blockchain transaction in the database
 */
export async function trackTransaction(
  txHash: string,
  txType: string,
  description: string,
  fromAddress: string,
  chainId: number,
  extraData?: Record<string, any>
): Promise<boolean> {
  try {
    if (!txHash || !fromAddress) {
      console.error("Missing required transaction data");
      return false;
    }

    console.log(`Tracking transaction ${txHash} of type ${txType}`);
    
    // Get current user to associate with transaction
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // If user is authenticated, try to get their wallet address from profile
    let profile = null;
    if (userId) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('wallet_address')
        .eq('id', userId)
        .maybeSingle();
        
      profile = profileData;
      
      // If we found a wallet address that doesn't match fromAddress, update it
      if (profile && profile.wallet_address !== fromAddress) {
        await supabase
          .from('profiles')
          .update({ wallet_address: fromAddress })
          .eq('id', userId);
      }
    }

    // Store transaction in database
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        transaction_hash: txHash,
        type: txType,
        from_address: fromAddress.toLowerCase(),
        to_address: extraData?.toAddress || null,
        amount: extraData?.amount || 0,
        status: 'pending',
        user_id: userId || null,
        metadata: {
          description,
          chainId,
          timestamp: new Date().toISOString(),
          ...extraData
        }
      })
      .select();

    if (error) {
      console.error("Error tracking transaction:", error);
      return false;
    }
    
    console.log("Transaction tracked successfully:", data);
    return true;
  } catch (error) {
    console.error("Exception in trackTransaction:", error);
    return false;
  }
}

/**
 * Update the status of a transaction in the database
 */
export async function updateTransactionStatus(
  txHash: string, 
  status: 'pending' | 'confirmed' | 'failed',
  details?: Record<string, any>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ 
        status, 
        metadata: details ? { ...details, updated_at: new Date().toISOString() } : undefined,
        updated_at: new Date().toISOString()
      })
      .eq('transaction_hash', txHash);
      
    if (error) {
      console.error("Error updating transaction status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in updateTransactionStatus:", error);
    return false;
  }
}

/**
 * Watch a transaction and update its status when confirmed
 */
export async function watchTransaction(web3: any, txHash: string, fromAddress: string): Promise<any> {
  try {
    console.log(`Watching transaction ${txHash} from ${fromAddress}`);
    
    // Create an interval to check for transaction receipt
    const checkReceipt = async () => {
      try {
        const receipt = await web3.eth.getTransactionReceipt(txHash);
        
        if (receipt) {
          console.log("Transaction confirmed:", receipt);
          const status = receipt.status ? 'confirmed' : 'failed';
          
          // Update transaction status in database
          await updateTransactionStatus(txHash, status, {
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed,
            confirmedAt: new Date().toISOString()
          });
          
          // Show toast notification
          if (status === 'confirmed') {
            toast.success("Transaction confirmed");
          } else {
            toast.error("Transaction failed");
          }
          
          return receipt;
        } else {
          // Check again in 3 seconds
          setTimeout(checkReceipt, 3000);
        }
      } catch (error) {
        console.error("Error checking transaction receipt:", error);
        
        // Try again after a delay
        setTimeout(checkReceipt, 5000);
      }
    };
    
    // Start checking
    checkReceipt();
    
    // Return the transaction hash
    return txHash;
  } catch (error) {
    console.error("Error watching transaction:", error);
    return null;
  }
}
