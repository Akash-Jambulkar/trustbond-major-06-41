
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

// Blockchain transaction type
export type BlockchainTransactionType = {
  id: string;
  hash: string;
  from_address: string;
  to_address?: string;
  type: string;
  description: string;
  status: "pending" | "confirmed" | "failed";
  metadata?: any;
  block_number?: number;
  network: string;
  timestamp: number;
  created_at: string;
};
