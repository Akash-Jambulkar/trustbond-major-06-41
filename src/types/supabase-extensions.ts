
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
