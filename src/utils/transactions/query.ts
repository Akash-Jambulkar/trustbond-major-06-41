
import { supabase } from '@/integrations/supabase/client';
import { blockchainTransactionsTable } from '../supabase-helper';

// Get blockchain transactions
export async function getBlockchainTransactions(userId?: string, limit = 10) {
  try {
    let query = blockchainTransactionsTable()
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching blockchain transactions:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getBlockchainTransactions:', error);
    return [];
  }
}

// Add transaction
export async function addBlockchainTransaction(transactionData: any) {
  try {
    const { data, error } = await blockchainTransactionsTable()
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
