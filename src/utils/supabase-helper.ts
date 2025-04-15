
import { supabase } from '@/integrations/supabase/client';
import type { 
  BankRegistrationType, 
  KycDocumentSubmissionType,
  KycVerificationVoteType,
  BlockchainTransactionType,
  TrustScoreType,
  LoanType,
  UsersMetadataType
} from '@/types/supabase-extensions';

/**
 * Helper functions for typed Supabase queries
 * These functions provide type safety when querying Supabase tables
 */

// KYC document submissions
export function kycSubmissionsTable() {
  return supabase.from('kyc_document_submissions');
}

// Bank registrations
export function bankRegistrationsTable() {
  return supabase.from('bank_registrations');
}

// KYC verification votes
export function kycVerificationVotesTable() {
  return supabase.from('kyc_verification_votes');
}

// Blockchain transactions
export function blockchainTransactionsTable() {
  return supabase.from('blockchain_transactions');
}

// Trust scores
export function trustScoresTable() {
  return supabase.from('trust_scores');
}

// Loans
export function loansTable() {
  return supabase.from('loans');
}

// Users metadata
export function usersMetadataTable() {
  return supabase.from('users_metadata');
}
