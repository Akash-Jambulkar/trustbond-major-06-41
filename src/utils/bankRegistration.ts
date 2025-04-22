
import { supabase } from '@/integrations/supabase/client';
import { BankRegistrationType } from '@/types/supabase-extensions';
import { bankRegistrationsTable } from '@/utils/supabase-helper';
import { generateMockTransactionHash } from '@/utils/mockBlockchain';

// Get bank registrations
export const getBankRegistrations = async (): Promise<BankRegistrationType[]> => {
  try {
    const { data, error } = await bankRegistrationsTable()
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching bank registrations:", error);
      return [];
    }
    
    return (data as any) || [];
  } catch (error) {
    console.error("Exception in getBankRegistrations:", error);
    return [];
  }
};

// Get bank registration status
export const getBankRegistrationStatus = async (bankId: string): Promise<string> => {
  try {
    const { data, error } = await bankRegistrationsTable()
      .select('status')
      .eq('id', bankId)
      .single();
    
    if (error) {
      console.error("Error fetching bank registration status:", error);
      return 'unknown';
    }
    
    return (data as any)?.status || 'unknown';
  } catch (error) {
    console.error("Exception in getBankRegistrationStatus:", error);
    return 'unknown';
  }
};

// Approve bank registration
export const approveBankRegistration = async (bankId: string): Promise<boolean> => {
  try {
    // Generate mock transaction hash for blockchain record
    const transactionHash = generateMockTransactionHash();
    
    // Update bank registration status
    const { error } = await bankRegistrationsTable()
      .update({
        status: 'approved',
        blockchain_tx_hash: transactionHash,
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', bankId);
    
    if (error) {
      console.error("Error approving bank registration:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in approveBankRegistration:", error);
    return false;
  }
};
