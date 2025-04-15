
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from './types';

// Get transactions for a specific user or all transactions
export async function getTransactions(userAddress?: string): Promise<Transaction[]> {
  try {
    // Use direct supabase query with type assertions to avoid type issues
    let query = supabase
      .from('blockchain_transactions' as any)
      .select('*')
      .order('created_at', { ascending: false });
      
    if (userAddress) {
      query = query.eq('from_address', userAddress.toLowerCase());
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    // Transform the raw data into Transaction objects with type safety
    return (data || []).map((tx: any) => ({
      hash: tx.hash,
      timestamp: new Date(tx.created_at).getTime(),
      status: tx.metadata?.status || 'pending',
      type: tx.type || 'other',
      description: tx.metadata?.description || 'Blockchain transaction',
      account: tx.from_address,
      network: tx.network_id?.toString() || 'unknown',
      blockNumber: tx.metadata?.blockNumber,
      metadata: tx.metadata || {}
    }));
  } catch (error) {
    console.error('Error in getTransactions:', error);
    return [];
  }
}

// Add transaction
export async function addBlockchainTransaction(transactionData: any) {
  try {
    // Use direct supabase query with type assertions to avoid type issues
    const { data, error } = await supabase
      .from('blockchain_transactions' as any)
      .insert(transactionData)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding blockchain transaction:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addBlockchainTransaction:', error);
    return null;
  }
}

// For backward compatibility, also implement clearTransactionHistory
export async function clearTransactionHistory(userAddress: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blockchain_transactions' as any)
      .delete()
      .eq('from_address', userAddress.toLowerCase());
      
    if (error) {
      console.error('Error clearing transaction history:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in clearTransactionHistory:', error);
    return false;
  }
}
