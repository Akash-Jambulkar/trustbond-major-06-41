
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
  verification_notes?: string;
  rejection_reason?: string;
  blockchain_tx_hash?: string;
}

// Bank Registration Type
export interface BankRegistrationType {
  id: string;
  name: string;
  email: string;
  registration_number: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
  verification_notes?: string;
  rejection_reason?: string;
  blockchain_tx_hash?: string;
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

/**
 * This declaration merges the Supabase Database type definition to include our custom tables
 */
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        kyc_document_submissions: {
          Row: KycDocumentSubmissionType;
          Insert: Omit<KycDocumentSubmissionType, 'id'> & { id?: string };
          Update: Partial<KycDocumentSubmissionType>;
        };
        bank_registrations: {
          Row: BankRegistrationType;
          Insert: Omit<BankRegistrationType, 'id'> & { id?: string };
          Update: Partial<BankRegistrationType>;
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
      };
    };
  }
}
