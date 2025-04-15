
import { supabase } from '@/integrations/supabase/client';
import type { 
  BankRegistrationType, 
  KycDocumentSubmissionType,
  KycVerificationVoteType,
  BlockchainTransactionType,
  TrustScoreType,
  LoanType
} from '@/types/supabase-extensions';

/**
 * Helper functions for typed Supabase queries
 * This resolves TypeScript issues with Supabase table types
 */

// KYC document submissions
export function kycSubmissionsTable() {
  return supabase.from('kyc_document_submissions') as unknown as ReturnType<typeof supabase.from<KycDocumentSubmissionType>>;
}

// Bank registrations
export function bankRegistrationsTable() {
  return supabase.from('bank_registrations') as unknown as ReturnType<typeof supabase.from<BankRegistrationType>>;
}

// KYC verification votes
export function kycVerificationVotesTable() {
  return supabase.from('kyc_verification_votes') as unknown as ReturnType<typeof supabase.from<KycVerificationVoteType>>;
}

// Blockchain transactions
export function blockchainTransactionsTable() {
  return supabase.from('blockchain_transactions') as unknown as ReturnType<typeof supabase.from<BlockchainTransactionType>>;
}

// Trust scores
export function trustScoresTable() {
  return supabase.from('trust_scores') as unknown as ReturnType<typeof supabase.from<TrustScoreType>>;
}

// Loans
export function loansTable() {
  return supabase.from('loans') as unknown as ReturnType<typeof supabase.from<LoanType>>;
}

// Users metadata
export function usersMetadataTable() {
  return supabase.from('users_metadata');
}
