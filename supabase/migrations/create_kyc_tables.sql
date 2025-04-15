
-- Create KYC document submissions table
CREATE TABLE IF NOT EXISTS public.kyc_document_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  document_hash TEXT NOT NULL,
  document_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verification_status TEXT NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  rejection_reason TEXT,
  blockchain_tx_hash TEXT
);

-- Create bank registrations table 
CREATE TABLE IF NOT EXISTS public.bank_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verification_notes TEXT,
  rejection_reason TEXT,
  blockchain_tx_hash TEXT
);

-- Create trust scores table
CREATE TABLE IF NOT EXISTS public.trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL,
  score INTEGER NOT NULL,
  previous_score INTEGER,
  change INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  calculation_hash TEXT,
  blockchain_tx_hash TEXT
);

-- Create blockchain transactions table
CREATE TABLE IF NOT EXISTS public.blockchain_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hash TEXT NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  block_number INTEGER,
  gas_used INTEGER,
  network TEXT NOT NULL
);

-- Create loans table
CREATE TABLE IF NOT EXISTS public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  borrower_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  term INTEGER NOT NULL,
  interest_rate NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  loan_hash TEXT,
  blockchain_tx_hash TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS kyc_user_id_idx ON public.kyc_document_submissions(user_id);
CREATE INDEX IF NOT EXISTS kyc_status_idx ON public.kyc_document_submissions(verification_status);
CREATE INDEX IF NOT EXISTS bank_reg_status_idx ON public.bank_registrations(status);
CREATE INDEX IF NOT EXISTS trust_user_address_idx ON public.trust_scores(user_address);
CREATE INDEX IF NOT EXISTS tx_from_address_idx ON public.blockchain_transactions(from_address);
CREATE INDEX IF NOT EXISTS tx_status_idx ON public.blockchain_transactions(status);
CREATE INDEX IF NOT EXISTS loans_borrower_idx ON public.loans(borrower_address);
CREATE INDEX IF NOT EXISTS loans_status_idx ON public.loans(status);
