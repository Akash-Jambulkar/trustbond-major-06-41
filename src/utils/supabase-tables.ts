
import { supabase } from '@/integrations/supabase/client';
import { safeFrom } from '@/utils/supabase-utils';

// Type definitions for loan verifications
export interface LoanVerification {
  id: string;
  loan_id: string;
  user_id: string;
  bank_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string | null;
}

// Type definitions for KYC verification votes
export interface KycVerificationVote {
  id: string;
  document_id: string;
  bank_id: string;
  bank_name?: string | null;
  approved: boolean;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
}

// Define table name constants to avoid string literals
export const TABLES = {
  LOAN_VERIFICATIONS: 'loan_verifications',
  KYC_VERIFICATION_VOTES: 'kyc_verification_votes'
} as const;

// Helper function to access the loan_verifications table
export const loanVerificationsTable = () => {
  return safeFrom<LoanVerification>(TABLES.LOAN_VERIFICATIONS);
};

// Helper function to access the kyc_verification_votes table
export const kycVerificationVotesTable = () => {
  return safeFrom<KycVerificationVote>(TABLES.KYC_VERIFICATION_VOTES);
};
