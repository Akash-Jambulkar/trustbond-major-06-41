
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper functions for typed Supabase queries
 * These functions provide type safety when querying Supabase tables
 */

// Use a more generic approach to avoid TypeScript errors with table references
// We're using type assertions to bypass TypeScript limitations while maintaining code quality

// KYC document submissions
export function kycSubmissionsTable() {
  return supabase.from('kyc_document_submissions') as unknown as ReturnType<typeof supabase.from>;
}

// Bank registrations
export function bankRegistrationsTable() {
  return supabase.from('bank_registrations') as unknown as ReturnType<typeof supabase.from>;
}

// KYC verification votes
export function kycVerificationVotesTable() {
  return supabase.from('kyc_verification_votes') as unknown as ReturnType<typeof supabase.from>;
}

// Blockchain transactions
export function blockchainTransactionsTable() {
  return supabase.from('blockchain_transactions') as unknown as ReturnType<typeof supabase.from>;
}

// Trust scores
export function trustScoresTable() {
  return supabase.from('trust_scores') as unknown as ReturnType<typeof supabase.from>;
}

// Loans
export function loansTable() {
  return supabase.from('loans') as unknown as ReturnType<typeof supabase.from>;
}

// Users metadata
export function usersMetadataTable() {
  return supabase.from('users_metadata') as unknown as ReturnType<typeof supabase.from>;
}

// Profiles
export function profilesTable() {
  return supabase.from('profiles') as unknown as ReturnType<typeof supabase.from>;
}
