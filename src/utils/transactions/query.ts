
import { supabase } from '@/integrations/supabase/client';
import { Transaction, TransactionStatus, TransactionType } from './types';

// Get transactions for a specific user
export async function getTransactions(userAddress?: string): Promise<Transaction[]> {
  try {
    // Get user ID from session if userAddress is not provided
    let userId = null;
    if (!userAddress) {
      const { data: authData } = await supabase.auth.getSession();
      userId = authData.session?.user?.id;
      
      if (!userId) {
        return [];
      }
    }
    
    // Query based on either wallet address or user ID
    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (userAddress) {
      query = query.eq('from_address', userAddress.toLowerCase());
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else {
      return [];
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
      status: (tx.status || 'pending') as TransactionStatus,
      type: (tx.type || 'other') as TransactionType,
      description: getTransactionDescription(tx),
      account: tx.from_address,
      network: tx.network_id || '1', // Default to mainnet
      metadata: {
        amount: tx.amount || 0,
        toAddress: tx.to_address || null
      }
    }));
  } catch (error) {
    console.error('Error in getTransactions:', error);
    throw error;
  }
}

// Helper to generate a human-readable transaction description
function getTransactionDescription(tx: any): string {
  switch (tx.type) {
    case 'kyc':
      return 'KYC Document Submission';
    case 'verification':
      return 'KYC Verification';
    case 'trust_score':
      return 'Trust Score Update';
    case 'loan_request':
      return `Loan Request: ${tx.amount} ETH`;
    case 'loan_approval':
      return 'Loan Approval';
    case 'loan_repayment':
      return `Loan Repayment: ${tx.amount} ETH`;
    case 'registration':
      return 'Bank Registration';
    default:
      return 'Blockchain Transaction';
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
      status: (data.status || 'pending') as TransactionStatus,
      type: (data.type || 'other') as TransactionType,
      description: getTransactionDescription(data),
      account: data.from_address,
      network: data.network_id || '1',
      metadata: {
        amount: data.amount || 0,
        toAddress: data.to_address || null
      }
    };
  } catch (error) {
    console.error('Error in getTransactionByHash:', error);
    throw error;
  }
}

// Add transaction
export async function addBlockchainTransaction(transactionData: any) {
  try {
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
