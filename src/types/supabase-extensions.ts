
/**
 * Extension types for Supabase tables
 */

// KYC Document Submission Type
export interface KycDocumentSubmissionType {
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
}

// Bank Registration Type
export interface BankRegistrationType {
  id: string;
  name: string;
  email: string;
  registration_number: string;
  wallet_address: string;
  status: 'pending' | 'approved' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
  verification_notes?: string;
  rejection_reason?: string;
  blockchain_tx_hash?: string;
  document_url?: string;
}

// Trust Score Type
export interface TrustScoreType {
  id: string;
  user_address: string;
  score: number;
  previous_score?: number;
  change: number;
  updated_at: string;
  calculation_hash?: string;
  blockchain_tx_hash?: string;
}

// Blockchain Transaction Type
export interface BlockchainTransactionType {
  id: string;
  hash: string;
  from_address: string;
  to_address: string;
  type: string;
  description: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  block_number?: number;
  gas_used?: number;
  network: string;
}

// Loan Type
export interface LoanType {
  id: string;
  borrower_address: string;
  amount: number;
  status: 'pending' | 'approved' | 'active' | 'repaid' | 'defaulted';
  term: number;
  interest_rate: number;
  timestamp: string;
  loan_hash?: string;
  blockchain_tx_hash?: string;
}

// KYC Verification Vote type
export interface KycVerificationVoteType {
  id: string;
  document_id: string;
  bank_id: string;
  bank_name: string;
  approved: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Users Metadata Type
export interface UsersMetadataType {
  id: string;
  role: string;
  wallet_address: string;
  is_verified: boolean;
}

// Transaction metadata type to ensure strong typing
export interface TransactionMetadata {
  description: string;
  status: "pending" | "confirmed" | "failed";
  network: string;
  blockNumber?: number;
}

// Consensus verification result type
export interface ConsensusVerificationResult {
  documentId: string;
  status: "pending" | "in_progress" | "approved" | "rejected";
  votesRequired: number;
  votesReceived: number;
  approvalsReceived: number;
  rejectionsReceived: number;
  votes: {
    bankId: string;
    bankName: string;
    approved: boolean;
    timestamp: string;
    notes?: string;
  }[];
  progress: number;
  consensusReached: boolean;
  finalDecision: boolean | null;
}

/**
 * This declaration merges the Supabase Database type definition to include our custom tables
 */
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        profiles: {
          Row: {
            id: string;
            created_at: string;
            updated_at: string;
            wallet_address: string | null;
            role: string;
            name: string | null;
            email: string | null;
          };
          Insert: {
            id?: string;
            created_at?: string;
            updated_at?: string;
            wallet_address?: string | null;
            role: string;
            name?: string | null;
            email?: string | null;
          };
          Update: Partial<{
            id: string;
            created_at: string;
            updated_at: string;
            wallet_address: string | null;
            role: string;
            name: string | null;
            email: string | null;
          }>;
        };
        kyc_document_submissions: {
          Row: KycDocumentSubmissionType;
          Insert: Omit<KycDocumentSubmissionType, 'id'> & { id?: string };
          Update: Partial<KycDocumentSubmissionType>;
        };
        bank_registrations: {
          Row: BankRegistrationType;
          Insert: Omit<BankRegistrationType, 'id' | 'created_at' | 'updated_at'> & { id?: string, created_at?: string, updated_at?: string };
          Update: Partial<BankRegistrationType>;
        };
        users_metadata: {
          Row: UsersMetadataType;
          Insert: UsersMetadataType;
          Update: Partial<UsersMetadataType>;
        };
        trust_scores: {
          Row: TrustScoreType;
          Insert: Omit<TrustScoreType, 'id'> & { id?: string };
          Update: Partial<TrustScoreType>;
        };
        blockchain_transactions: {
          Row: BlockchainTransactionType;
          Insert: Omit<BlockchainTransactionType, 'id'> & { id?: string };
          Update: Partial<BlockchainTransactionType>;
        };
        loans: {
          Row: LoanType;
          Insert: Omit<LoanType, 'id'> & { id?: string };
          Update: Partial<LoanType>;
        };
        kyc_verification_votes: {
          Row: KycVerificationVoteType;
          Insert: Omit<KycVerificationVoteType, 'id'> & { id?: string };
          Update: Partial<KycVerificationVoteType>;
        };
      };
    };
  }
}
