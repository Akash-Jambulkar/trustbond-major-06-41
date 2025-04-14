
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Transaction, TransactionStatus, TransactionType, getMetadataValue } from "./types";

/**
 * Get all transactions for an account
 */
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
      const txMetadata = tx.metadata as Record<string, Json> || {};
      
      return {
        hash: tx.hash,
        timestamp: tx.timestamp,
        status: getMetadataValue(txMetadata, 'status', 'pending') as TransactionStatus,
        type: tx.type as TransactionType,
        description: getMetadataValue(txMetadata, 'description', ""),
        account: tx.from_address,
        network: getMetadataValue(txMetadata, 'network', ""),
        blockNumber: getMetadataValue(txMetadata, 'blockNumber', undefined),
        metadata: tx.metadata
      };
    });
  } catch (err) {
    console.error("Failed to fetch transactions from database:", err);
    return [];
  }
};

/**
 * Clear transaction history (for testing or privacy)
 */
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
