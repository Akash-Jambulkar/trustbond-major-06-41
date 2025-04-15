
import { createClient } from '@supabase/supabase-js';

// These are public keys that can be safely used in the client
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

// In a real implementation, these would come from environment variables
// but for now we'll use placeholders
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type UserProfile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'user' | 'bank' | 'admin';
  created_at: string;
  mfa_enabled: boolean;
  address?: string;
  phone?: string;
  kyc_status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
  trust_score?: number;
};

export type KYCDocument = {
  id: string;
  user_id: string;
  document_type: string;
  document_hash: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_by?: string;
  created_at: string;
  updated_at: string;
};

export type Loan = {
  id: string;
  user_id: string;
  bank_id: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted';
  purpose: string;
  created_at: string;
  updated_at: string;
  blockchain_address?: string;
};

export type Bank = {
  id: string;
  user_id: string;
  name: string;
  license_number: string;
  address: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_by?: string;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  transaction_hash: string;
  type: 'kyc' | 'loan' | 'verification' | 'repayment';
  from_address?: string;
  to_address?: string;
  amount?: number;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  updated_at: string;
  user_id?: string;
  bank_id?: string;
};

// Helper function to get the current user's profile
export const getCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  return data as UserProfile | null;
};
