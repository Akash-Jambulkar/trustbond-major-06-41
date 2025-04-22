
// Types for Supabase database tables

export type KycDocumentSubmissionType = {
  id: string;
  user_id: string;
  document_type: string;
  document_hash: string;
  submitted_at: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_at?: string | null;
  rejection_reason?: string | null;
  wallet_address?: string | null;
  verification_tx_hash?: string | null;
  verifier_address?: string | null;
  blockchain_tx_hash?: string | null;
};

export type ProfileType = {
  id: string;
  user_id: string;
  email: string;
  name?: string | null;
  role: 'user' | 'bank' | 'admin';
  created_at: string;
  updated_at: string;
  mfa_enabled: boolean;
  wallet_address?: string | null;
  kyc_status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  trust_score?: number | null;
  phone?: string | null;
  address?: string | null;
};

export type TransactionType = {
  id: string;
  transaction_hash: string;
  type: 'kyc' | 'verification' | 'loan' | 'repayment';
  from_address?: string | null;
  to_address?: string | null;
  amount?: number | null;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  updated_at: string;
  user_id?: string | null;
  bank_id?: string | null;
};

export type UserRoleAssignmentType = {
  id: string;
  user_id: string;
  role: 'user' | 'bank' | 'admin';
  assigned_at: string;
  assigned_by?: string | null;
  updated_at: string;
};
