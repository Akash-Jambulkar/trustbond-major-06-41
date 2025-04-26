// Types for Supabase database tables

export type KycDocumentSubmissionType = {
  id: string;
  user_id: string;
  document_type: string;
  document_number?: string | null;
  document_hash: string;
  submitted_at: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_at?: string | null;
  rejection_reason?: string | null;
  wallet_address?: string | null;
  verification_tx_hash?: string | null;
  verifier_address?: string | null;
  blockchain_tx_hash?: string | null;
  consensus_status?: 'pending' | 'in_progress' | 'approved' | 'rejected' | null;
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

// Add missing types for bank registration
export type BankRegistrationType = {
  id: string;
  name: string;
  registration_number: string;
  wallet_address: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  document_url?: string | null;
  blockchain_tx_hash?: string | null;
};

// Type for KYC verification votes
export type KycVerificationVoteType = {
  id: string;
  document_id: string;
  bank_id: string;
  bank_name?: string | null;
  approved: boolean;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
};

// For blockchain transactions
export type BlockchainTransactionType = {
  id: string;
  transaction_hash: string;
  type: string;
  from_address: string;
  to_address?: string | null;
  amount?: number | null;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  updated_at: string;
  user_id?: string | null;
  bank_id?: string | null;
  metadata?: any;
};

// User metadata type
export type UsersMetadataType = {
  id: string;
  user_id: string;
  metadata: any;
  created_at: string;
  updated_at: string;
};
