
import { Database } from '@/integrations/supabase/types';

// Extend existing types or add new custom types here
export type ExtendedDatabase = Database & {
  // Add any additional type extensions or custom types
  customType?: string;
};

// If you need to extend specific tables
export type ExtendedTables = {
  [K in keyof Database['public']['Tables']]: 
    Database['public']['Tables'][K]['Row'] & {
      // Add any additional fields or modify existing ones
      // Example: customField?: string;
    }
};

// Bank registration type
export type BankRegistrationType = {
  id: string;
  name: string;
  registration_number: string;
  wallet_address: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  document_url?: string;
  blockchain_tx_hash?: string;
};

// KYC Document Submission type
export type KycDocumentSubmissionType = {
  id: string;
  user_id: string;
  document_type: string;
  document_number: string;
  document_hash: string;
  submitted_at: string;
  verification_status: "pending" | "verified" | "rejected";
  verified_at?: string;
  verified_by?: string;
  blockchain_tx_hash?: string;
  consensus_status?: "pending" | "in_progress" | "approved" | "rejected";
};

// KYC Verification Vote type
export type KycVerificationVoteType = {
  id: string;
  document_id: string;
  bank_id: string;
  bank_name: string;
  approved: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
};

// Transaction metadata type to ensure strong typing
export type TransactionMetadata = {
  description: string;
  status: "pending" | "confirmed" | "failed";
  network: string;
  blockNumber?: number;
};

// Blockchain transaction type
export type BlockchainTransactionType = {
  id: string;
  hash: string;
  from_address: string;
  to_address?: string;
  type: string;
  data_hash: string;
  gas_price: string;
  gas_used: string;
  metadata?: TransactionMetadata;
  timestamp: number;
  created_at: string;
};

// Consensus verification result type
export type ConsensusVerificationResult = {
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
};
