import { createClient } from '@supabase/supabase-js';

// Use hardcoded values from the Supabase project
const SUPABASE_URL = 'https://lbblmnhjqotmlovzkydk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYmxtbmhqcW90bWxvdnpreWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NzQ3ODAsImV4cCI6MjA1OTU1MDc4MH0.QGBVLEISMcRYDoxMPlyHzGLA0h-bsRuCt8cMyd40oKQ';

// Initialize the Supabase client
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Ensure we have the necessary tables for our application
export async function ensureTablesExist() {
  try {
    // Check if kyc_document_submissions table exists
    const { data: kycSubmissions, error: kycSubmissionsError } = await supabase
      .from('kyc_document_submissions')
      .select('id')
      .limit(1);

    if (kycSubmissionsError) {
      console.error('Error checking kyc_document_submissions table:', kycSubmissionsError.message);
      console.log('You may need to create the kyc_document_submissions table with proper schema.');
    }

    // Check if transactions table exists
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('id')
      .limit(1);

    if (transactionsError) {
      console.error('Error checking transactions table:', transactionsError.message);
      console.log('You may need to create the transactions table with proper schema.');
    }
  } catch (error) {
    console.error('Error checking database tables:', error);
  }
}

// Define SQL to create tables if needed
export const createKYCSubmissionsTableSQL = `
CREATE TABLE IF NOT EXISTS kyc_document_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  document_hash TEXT NOT NULL,
  document_type TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  blockchain_tx_hash TEXT,
  verification_tx_hash TEXT,
  verifier_address TEXT,
  wallet_address TEXT
);

-- Enable Row Level Security
ALTER TABLE kyc_document_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own submissions" 
ON kyc_document_submissions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Banks can view all submissions" 
ON kyc_document_submissions FOR SELECT 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'bank');

CREATE POLICY "Banks can update submissions" 
ON kyc_document_submissions FOR UPDATE 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'bank');

CREATE POLICY "Admins have full access" 
ON kyc_document_submissions FOR ALL 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
`;

export const createTransactionsTableSQL = `
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_hash TEXT UNIQUE,
  transaction_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  related_entity_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  from_address TEXT,
  to_address TEXT,
  amount NUMERIC,
  gas_used NUMERIC,
  gas_price NUMERIC,
  blockchain_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transactions" 
ON transactions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Banks can view related transactions" 
ON transactions FOR SELECT 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'bank' AND
  transaction_type IN ('kyc_verification', 'loan_approval', 'trust_score_update')
);

CREATE POLICY "Admins have full access" 
ON transactions FOR ALL 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert transactions" 
ON transactions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Banks can insert verification transactions" 
ON transactions FOR INSERT 
TO authenticated 
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'bank');
`;
