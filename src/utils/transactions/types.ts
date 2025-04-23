
import { Json } from "@/integrations/supabase/types";

// Transaction types
export type TransactionType = 'kyc' | 'loan' | 'verification' | 'registration' | 'trust_score' | 'other';

// Transaction status
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

// Transaction object
export interface Transaction {
  hash: string;
  timestamp: number;
  status: TransactionStatus;
  type: TransactionType;
  description: string;
  account: string;
  network: string | number;
  blockNumber?: number;
  metadata?: any;
}

// Helper function to convert transaction metadata to Supabase-compatible format
export const createTransactionMetadata = (
  transaction: Transaction
): Record<string, Json> => {
  return {
    description: transaction.description,
    status: transaction.status,
    network: String(transaction.network),
    blockNumber: transaction.blockNumber,
    ...(transaction.metadata || {})
  };
};

// Helper function to safely extract metadata fields
export const getMetadataValue = <T>(
  metadata: Record<string, Json> | null | undefined,
  key: string,
  defaultValue: T
): T => {
  if (!metadata) return defaultValue;
  const value = metadata[key];
  return value !== undefined && value !== null ? value as unknown as T : defaultValue;
};
