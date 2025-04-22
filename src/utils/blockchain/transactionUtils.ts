
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { generateMockTransactionHash } from "@/utils/mockBlockchain";

// Get transaction history from database
export const getTransactionHistoryFromDb = async (userId: string, userRole: string) => {
  try {
    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by user role
    if (userRole === 'user') {
      query = query.eq('user_id', userId);
    } else if (userRole === 'bank') {
      query = query.eq('bank_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Transaction history error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Transaction history error:", error);
    return [];
  }
};

// Simulate blockchain event (for testing purposes only)
export const simulateBlockchainEventInDb = async (account: string, userId: string) => {
  // Generate random event type
  const eventTypes = ['kyc', 'loan', 'verification', 'repayment'];
  const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  // Generate transaction hash
  const transactionHash = generateMockTransactionHash();

  // Simulate transaction
  try {
    await supabase
      .from('transactions')
      .insert([
        {
          transaction_hash: transactionHash,
          type: randomEventType,
          from_address: account,
          status: 'confirmed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: userId
        }
      ]);
    toast.success("Simulated blockchain event created");
    return true;
  } catch (error) {
    console.error("Simulation error:", error);
    toast.error("Failed to simulate blockchain event");
    return false;
  }
};

// Watch transaction and update status when confirmed
export const watchTransaction = async (web3: any, txHash: string) => {
  try {
    // Poll for transaction receipt
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    
    // If receipt exists, transaction is confirmed
    if (receipt) {
      console.log("Transaction confirmed:", receipt);
      
      // Update transaction status in database
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: receipt.status ? 'confirmed' : 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('transaction_hash', txHash);
      
      if (error) {
        console.error("Error updating transaction status:", error);
      }
      
      return receipt;
    } else {
      // Check again in 3 seconds
      setTimeout(() => watchTransaction(web3, txHash), 3000);
      return null;
    }
  } catch (error) {
    console.error("Error watching transaction:", error);
    return null;
  }
};
