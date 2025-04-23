
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from './types';

// Get transactions for a specific user or all transactions
export async function getTransactions(userAddress?: string): Promise<Transaction[]> {
  try {
    // Use direct supabase query
    let query = supabase
      .from('blockchain_transactions')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (userAddress) {
      query = query.eq('from_address', userAddress.toLowerCase());
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
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
    throw error;
  }
}

// Get a specific transaction by hash
export async function getTransactionByHash(hash: string): Promise<Transaction | null> {
  try {
    const { data, error } = await supabase
      .from('blockchain_transactions')
      .select('*')
      .eq('hash', hash.toLowerCase())
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching transaction by hash:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      hash: data.hash,
      timestamp: new Date(data.created_at).getTime(),
      status: data.metadata?.status || 'pending',
      type: data.type || 'other',
      description: data.metadata?.description || 'Blockchain transaction',
      account: data.from_address,
      network: data.network_id?.toString() || 'unknown',
      blockNumber: data.metadata?.blockNumber,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Error in getTransactionByHash:', error);
    throw error;
  }
}

// Add transaction
export async function addBlockchainTransaction(transactionData: any) {
  try {
    // Use direct supabase query
    const { data, error } = await supabase
      .from('blockchain_transactions')
      .insert(transactionData)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding blockchain transaction:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addBlockchainTransaction:', error);
    throw error;
  }
}

// Update transaction
export async function updateBlockchainTransaction(hash: string, updates: any) {
  try {
    const { error } = await supabase
      .from('blockchain_transactions')
      .update(updates)
      .eq('hash', hash.toLowerCase());
      
    if (error) {
      console.error('Error updating blockchain transaction:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateBlockchainTransaction:', error);
    throw error;
  }
}

// For backward compatibility, also implement clearTransactionHistory
export async function clearTransactionHistory(userAddress: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blockchain_transactions')
      .delete()
      .eq('from_address', userAddress.toLowerCase());
      
    if (error) {
      console.error('Error clearing transaction history:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in clearTransactionHistory:', error);
    throw error;
  }
}
