
# Supabase Setup for TrustBond

This directory contains database migration files for setting up the necessary tables in your Supabase project.

## Database Migrations

The `migrations` directory contains SQL files that should be run in your Supabase SQL editor to create the required tables:

1. **create_kyc_tables.sql**: Creates tables for KYC document submissions, bank registrations, trust scores, blockchain transactions, and loans.

## How to Run Migrations

1. Log in to your Supabase dashboard.
2. Select your project.
3. Go to the "SQL Editor" section.
4. Create a new query.
5. Copy the contents of the migration file (e.g., `create_kyc_tables.sql`).
6. Paste the SQL into the query editor.
7. Click "Run" to execute the SQL commands.

## Database Schema

### KYC Document Submissions

Stores information about user KYC document submissions:

- **id**: Unique identifier for the submission
- **user_id**: User's ID or wallet address
- **document_type**: Type of document (e.g., passport, national ID)
- **document_number**: Document identifier number
- **document_hash**: Blockchain hash of the document
- **document_url**: URL to the stored document
- **submitted_at**: Timestamp of submission
- **verification_status**: Status of verification (pending, verified, rejected)
- **verified_at**: Timestamp of verification
- **verification_notes**: Notes from the verifier
- **rejection_reason**: Reason for rejection if rejected
- **blockchain_tx_hash**: Blockchain transaction hash for the submission

### Bank Registrations

Stores information about bank registration requests:

- **id**: Unique identifier for the registration
- **name**: Bank name
- **email**: Contact email
- **registration_number**: Official registration number
- **status**: Status of the registration (pending, verified, rejected)
- **created_at**: Timestamp of creation
- **updated_at**: Timestamp of last update
- **verification_notes**: Notes from the verifier
- **rejection_reason**: Reason for rejection if rejected
- **blockchain_tx_hash**: Blockchain transaction hash for the registration

### Trust Scores

Stores user trust scores:

- **id**: Unique identifier
- **user_address**: User's wallet address
- **score**: Current trust score
- **previous_score**: Previous trust score
- **change**: Change in trust score
- **updated_at**: Timestamp of last update
- **calculation_hash**: Hash of the calculation method
- **blockchain_tx_hash**: Blockchain transaction hash

### Blockchain Transactions

Stores information about blockchain transactions:

- **id**: Unique identifier
- **hash**: Transaction hash
- **from_address**: Sender address
- **to_address**: Recipient address
- **type**: Transaction type
- **description**: Description of the transaction
- **status**: Status of the transaction (pending, confirmed, failed)
- **timestamp**: Timestamp of the transaction
- **block_number**: Block number containing the transaction
- **gas_used**: Gas used for the transaction
- **network**: Blockchain network ID

### Loans

Stores information about loans:

- **id**: Unique identifier
- **borrower_address**: Borrower's wallet address
- **amount**: Loan amount
- **status**: Status of the loan (pending, approved, active, repaid, defaulted)
- **term**: Loan term in months
- **interest_rate**: Annual interest rate
- **timestamp**: Timestamp of creation
- **loan_hash**: Hash of the loan details
- **blockchain_tx_hash**: Blockchain transaction hash for the loan
