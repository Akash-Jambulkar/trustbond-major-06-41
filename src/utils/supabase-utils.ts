
import { supabase } from '@/integrations/supabase/client';
import { 
  KycDocumentSubmissionType, 
  BankRegistrationType, 
  BlockchainTransactionType 
} from '@/types/supabase-extensions';

/**
 * Utility functions for type-safe Supabase queries
 */

// Generic type-casting for query results to handle type issues
export function typeCast<T>(data: any): T {
  return data as T;
}

// Type-safe query builder for tables not fully defined in generated types
export function safeFrom<T = any>(table: string) {
  return supabase.from(table as any) as any;
}

// Type-safe query wrapper for KYC document submissions
export async function queryKycSubmissions() {
  const { data, error } = await safeFrom('kyc_document_submissions').select('*');
  if (error) {
    console.error('Error querying KYC submissions:', error);
    return [];
  }
  return typeCast<KycDocumentSubmissionType[]>(data || []);
}

// Type-safe query wrapper for bank registrations
export async function queryBankRegistrations() {
  const { data, error } = await safeFrom('bank_registrations').select('*');
  if (error) {
    console.error('Error querying bank registrations:', error);
    return [];
  }
  return typeCast<BankRegistrationType[]>(data || []);
}

// Type-safe query wrapper for blockchain transactions
export async function queryBlockchainTransactions() {
  const { data, error } = await safeFrom('blockchain_transactions').select('*');
  if (error) {
    console.error('Error querying blockchain transactions:', error);
    return [];
  }
  return typeCast<BlockchainTransactionType[]>(data || []);
}
