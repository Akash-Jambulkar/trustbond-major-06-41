
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Type utility for making supabase queries more type-safe
 * This bypasses the strict typing for tables that aren't fully defined in the generated types
 */
export type GenericTable = string;

// Extended Supabase client type
export type SafeSupabaseClient = Omit<SupabaseClient, 'from'> & {
  from: (table: GenericTable) => any;
};

// Document types for reference
export type KycDocumentSubmission = {
  id: string;
  user_id: string;
  document_type: string;
  document_number: string;
  document_hash: string;
  document_url?: string;
  submitted_at: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_at?: string;
  verified_by?: string;
  verification_notes?: string;
  rejection_reason?: string;
  blockchain_tx_hash?: string;
  consensus_status?: "pending" | "in_progress" | "approved" | "rejected";
};

// Helper functions to update database records safely
export function updateKycDocument(id: string, data: Partial<KycDocumentSubmission>) {
  return {
    ...data,
    updated_at: new Date().toISOString()
  };
}
