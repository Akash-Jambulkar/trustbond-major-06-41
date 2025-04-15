
import { supabase } from '@/integrations/supabase/client';
import { BankRegistrationType } from '@/types/supabase-extensions';
import { bankRegistrationsTable } from '@/utils/supabase-helper';

/**
 * Get all bank registrations
 */
export async function getAllBankRegistrations(): Promise<BankRegistrationType[]> {
  try {
    const { data, error } = await bankRegistrationsTable()
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching bank registrations:", error);
      return [];
    }

    return (data || []) as BankRegistrationType[];
  } catch (error) {
    console.error("Exception in getAllBankRegistrations:", error);
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

    return (data || []) as BankRegistrationType[];
  } catch (error) {
    console.error("Exception in getPendingBankRegistrations:", error);
    return [];
  }
}

/**
 * Register a new bank
 */
export async function registerBank(registration: Omit<BankRegistrationType, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
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
      console.error("Error registering bank:", error);
      return null;
    }

    return (data as any)?.id || null;
  } catch (error) {
    console.error("Exception in registerBank:", error);
    return null;
  }
}
