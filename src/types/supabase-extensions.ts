
// This file will contain extensions to Supabase types

export interface KycDocumentSubmissionType {
  id: string;
  user_id: string;
  document_type: string;
  document_number: string;
  document_hash: string;
  document_url?: string;
  submitted_at: string;
  verification_status: "pending" | "verified" | "rejected";
  verified_at?: string;
  blockchain_tx_hash?: string;
  rejection_reason?: string;
}

export interface BankRegistrationType {
  id: string;
  name: string;
  registration_number: string;
  wallet_address: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string | null;
  document_url?: string;
  blockchain_tx_hash?: string;
}

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

export interface TransactionMetadata {
  description: string;
  status: "pending" | "confirmed" | "failed";
  network: string;
  blockNumber?: number;
  [key: string]: string | number | boolean | undefined; // Add index signature to make it compatible with Json
}

export interface BlockchainTransactionType {
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
}
