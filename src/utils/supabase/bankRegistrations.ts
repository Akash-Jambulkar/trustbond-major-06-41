
import { supabase } from '@/integrations/supabase/client';
import { BankRegistrationType } from '@/types/supabase-extensions';
import { bankRegistrationsTable } from '@/utils/supabase-helper';
import { generateMockTransactionHash } from '@/utils/mockBlockchain';

/**
 * Get all bank registrations
 */
export async function getAllBankRegistrations(): Promise<any[]> {
  try {
    const { data, error } = await bankRegistrationsTable()
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching bank registrations:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exception in getAllBankRegistrations:", error);
    return [];
  }
}

/**
 * Submit a new bank registration
 */
export async function submitBankRegistration(registration: Omit<BankRegistrationType, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<string | null> {
  try {
    const { data, error } = await bankRegistrationsTable()
      .insert({
        ...registration,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error("Error submitting bank registration:", error);
      return null;
    }

    return (data as any)?.id || null;
  } catch (error) {
    console.error("Exception in submitBankRegistration:", error);
    return null;
  }
}

/**
 * Get bank registration by ID
 */
export async function getBankRegistrationById(id: string): Promise<any | null> {
  try {
    const { data, error } = await bankRegistrationsTable()
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching bank registration:", error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error("Exception in getBankRegistrationById:", error);
    return null;
  }
}
