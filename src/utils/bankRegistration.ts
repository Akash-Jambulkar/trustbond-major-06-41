
import { supabase } from '@/integrations/supabase/client';
import { BankRegistrationType } from '@/types/supabase-extensions';
import { bankRegistrationsTable } from '@/utils/supabase-helper';

// Get bank registrations
export const getBankRegistrations = async (): Promise<BankRegistrationType[]> => {
  try {
    const { data, error } = await bankRegistrationsTable()
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching bank registrations:", error);
      throw error;
    }
    
    return (data as any) || [];
  } catch (error) {
    console.error("Exception in getBankRegistrations:", error);
    throw error;
  }
};

// Get bank registration by wallet address
export const getBankRegistrationByWalletAddress = async (walletAddress: string): Promise<BankRegistrationType | null> => {
  try {
    const { data, error } = await bankRegistrationsTable()
      .select('*')
      .eq('wallet_address', walletAddress)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching bank registration by wallet:", error);
      throw error;
    }
    
    return (data as any) || null;
  } catch (error) {
    console.error("Exception in getBankRegistrationByWalletAddress:", error);
    throw error;
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
      throw error;
    }
    
    return (data as any)?.status || 'unknown';
  } catch (error) {
    console.error("Exception in getBankRegistrationStatus:", error);
    throw error;
  }
};

// Submit bank registration
export const submitBankRegistration = async (registration: Omit<BankRegistrationType, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<string | null> => {
  try {
    const newRegistration = {
      ...registration,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await bankRegistrationsTable()
      .insert(newRegistration)
      .select('id')
      .single();
    
    if (error) {
      console.error("Error submitting bank registration:", error);
      throw error;
    }
    
    return (data as any)?.id || null;
  } catch (error) {
    console.error("Exception in submitBankRegistration:", error);
    throw error;
  }
};

// Approve bank registration
export const approveBankRegistration = async (bankId: string, txHash?: string): Promise<boolean> => {
  try {
    const updates: any = {
      status: 'approved',
      updated_at: new Date().toISOString()
    };
    
    if (txHash) {
      updates.blockchain_tx_hash = txHash;
    }
    
    const { error } = await bankRegistrationsTable()
      .update(updates)
      .eq('id', bankId);
    
    if (error) {
      console.error("Error approving bank registration:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in approveBankRegistration:", error);
    throw error;
  }
};

// Reject bank registration
export const rejectBankRegistration = async (bankId: string, reason?: string): Promise<boolean> => {
  try {
    const updates: any = {
      status: 'rejected',
      updated_at: new Date().toISOString()
    };
    
    if (reason) {
      updates.rejection_reason = reason;
    }
    
    const { error } = await bankRegistrationsTable()
      .update(updates)
      .eq('id', bankId);
    
    if (error) {
      console.error("Error rejecting bank registration:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in rejectBankRegistration:", error);
    throw error;
  }
};
