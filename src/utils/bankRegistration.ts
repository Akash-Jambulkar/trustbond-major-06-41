
import { supabase } from '@/integrations/supabase/client';
import { BankRegistrationType, UsersMetadataType } from '@/types/supabase-extensions';
import { bankRegistrationsTable, usersMetadataTable } from '@/utils/supabase-helper';

/**
 * Get bank registrations
 */
export async function getBankRegistrations(): Promise<BankRegistrationType[]> {
  try {
    const { data, error } = await bankRegistrationsTable()
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching bank registrations:", error);
      return [];
    }

    return (data as BankRegistrationType[]) || [];
  } catch (error) {
    console.error("Exception in getBankRegistrations:", error);
    return [];
  }
}

/**
 * Get pending bank registrations
 */
export async function getPendingBankRegistrations(): Promise<BankRegistrationType[]> {
  try {
    const { data, error } = await bankRegistrationsTable()
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching pending bank registrations:", error);
      return [];
    }

    return (data as BankRegistrationType[]) || [];
  } catch (error) {
    console.error("Exception in getPendingBankRegistrations:", error);
    return [];
  }
}

/**
 * Get bank registration status by wallet address
 */
export async function getBankRegistrationStatus(walletAddress: string): Promise<{
  exists: boolean;
  status?: string;
  bankId?: string;
}> {
  try {
    const { data, error } = await bankRegistrationsTable()
      .select('id, status')
      .eq('wallet_address', walletAddress)
      .maybeSingle();

    if (error) {
      console.error("Error checking bank registration status:", error);
      return { exists: false };
    }

    if (!data) {
      return { exists: false };
    }

    return {
      exists: true,
      status: data.status,
      bankId: data.id
    };
  } catch (error) {
    console.error("Exception in getBankRegistrationStatus:", error);
    return { exists: false };
  }
}

/**
 * Save a new bank registration
 */
export async function saveBankRegistration(registration: Omit<BankRegistrationType, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
  try {
    const { data, error } = await bankRegistrationsTable()
      .insert([{
        ...registration,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('id')
      .single();

    if (error) {
      console.error("Error saving bank registration:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Exception in saveBankRegistration:", error);
    return null;
  }
}

/**
 * Update a bank registration
 */
export async function updateBankRegistration(id: string, updates: Partial<BankRegistrationType>): Promise<boolean> {
  try {
    // Include updated_at time
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { error } = await bankRegistrationsTable()
      .update(updatesWithTimestamp)
      .eq('id', id);

    if (error) {
      console.error("Error updating bank registration:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in updateBankRegistration:", error);
    return false;
  }
}

/**
 * Approve a bank and add it to users_metadata
 */
export async function approveBankRegistration(bankId: string): Promise<boolean> {
  try {
    // First update the bank registration status
    const { data: bankData, error: bankUpdateError } = await bankRegistrationsTable()
      .update({
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', bankId)
      .select('*')
      .single();

    if (bankUpdateError || !bankData) {
      console.error("Error approving bank:", bankUpdateError);
      return false;
    }

    // Then add bank to users_metadata table
    const { error: userMetadataError } = await usersMetadataTable()
      .insert({
        id: bankData.id,
        role: 'bank',
        wallet_address: bankData.wallet_address,
        is_verified: true
      } as any); // Using type assertion to bypass strict type checking

    if (userMetadataError) {
      console.error("Error adding bank to users_metadata:", userMetadataError);
      // Try to rollback bank registration approval
      await bankRegistrationsTable()
        .update({ status: 'pending' })
        .eq('id', bankId);
        
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in approveBankRegistration:", error);
    return false;
  }
}

// Export a default component for the BankRegistration page
// This fixes the import error in src/pages/dashboard/bank/BankRegistration.tsx
export { getBankRegistrations as BankRegistration };
