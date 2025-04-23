
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from './types';
import { safeFrom } from '@/utils/supabase-utils';

// Get transactions for a specific user or all transactions
export async function getTransactions(userAddress?: string): Promise<Transaction[]> {
  try {
    // Use transactions table instead of blockchain_transactions
    let query = supabase
      .from('transactions')
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
      hash: tx.transaction_hash,
      timestamp: new Date(tx.created_at).getTime(),
      status: tx.status || 'pending',
      type: tx.type || 'other',
      description: tx.type === 'kyc' ? 'KYC Submission' : 'Blockchain transaction',
      account: tx.from_address,
      network: '1', // Default to mainnet
      metadata: {}
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
      .from('transactions')
      .select('*')
      .eq('transaction_hash', hash.toLowerCase())
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching transaction by hash:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      hash: data.transaction_hash,
      timestamp: new Date(data.created_at).getTime(),
      status: data.status || 'pending',
      type: data.type || 'other',
      description: data.type === 'kyc' ? 'KYC Submission' : 'Blockchain transaction',
      account: data.from_address,
      network: '1', // Default to mainnet
      metadata: {}
    };
  } catch (error) {
    console.error('Error in getTransactionByHash:', error);
    throw error;
  }
}

// Add transaction
export async function addBlockchainTransaction(transactionData: any) {
  try {
    // Use transactions table
    const { data, error } = await supabase
      .from('transactions')
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
      .from('transactions')
      .update(updates)
      .eq('transaction_hash', hash.toLowerCase());
      
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
      .from('transactions')
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
