
import { supabase } from '@/integrations/supabase/client';
import { BankRegistrationType } from '@/types/supabase-extensions';
import { bankRegistrationsTable } from '@/utils/supabase-helper';

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

    return data as BankRegistrationType[];
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

    return data as BankRegistrationType[];
  } catch (error) {
    console.error("Exception in getPendingBankRegistrations:", error);
    return [];
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

    return data.id;
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
