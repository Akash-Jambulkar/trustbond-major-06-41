
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper functions for typed Supabase queries
 * These functions provide type safety when querying Supabase tables
 */

// Type assertion function for uniform handling
const fromTable = (tableName: string) => supabase.from(tableName as any) as any;

// KYC document submissions
export function kycSubmissionsTable() {
  return fromTable('kyc_document_submissions');
}

// Bank registrations
export function bankRegistrationsTable() {
  return fromTable('bank_registrations');
}

// KYC verification votes
export function kycVerificationVotesTable() {
  return fromTable('kyc_verification_votes');
}

// Blockchain transactions
export function blockchainTransactionsTable() {
  return fromTable('blockchain_transactions');
}

// Trust scores
export function trustScoresTable() {
  return fromTable('trust_scores');
}

// Loans
export function loansTable() {
  return fromTable('loans');
}

// Users metadata
export function usersMetadataTable() {
  return fromTable('users_metadata');
}

// Profiles
export function profilesTable() {
  return supabase.from('profiles');
}
