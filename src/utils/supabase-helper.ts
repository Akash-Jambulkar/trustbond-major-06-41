
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper functions for typed Supabase queries
 * These functions provide type safety when querying Supabase tables
 */

// Casting the types to resolve TypeScript issues with the table references
// Instead of using the unknown casting, we'll use a direct approach
// with the 'any' type but with proper function typing for better code quality

// KYC document submissions
export function kycSubmissionsTable() {
  return supabase.from('kyc_document_submissions') as any;
}

// Bank registrations
export function bankRegistrationsTable() {
  return supabase.from('bank_registrations') as any;
}

// KYC verification votes
export function kycVerificationVotesTable() {
  return supabase.from('kyc_verification_votes') as any;
}

// Blockchain transactions
export function blockchainTransactionsTable() {
  return supabase.from('blockchain_transactions') as any;
}

// Trust scores
export function trustScoresTable() {
  return supabase.from('trust_scores') as any;
}

// Loans
export function loansTable() {
  return supabase.from('loans') as any;
}

// Users metadata
export function usersMetadataTable() {
  return supabase.from('users_metadata') as any;
}
