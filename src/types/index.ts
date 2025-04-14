
// User types
export type UserRole = 'user' | 'bank' | 'admin' | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress: string;
}

// KYC Document types
export interface KycDocument {
  id: number;
  name: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedDate: string;
  verifiedDate: string | null;
}

export interface KycRequest {
  id: number;
  userId: string;
  userName: string;
  walletAddress: string;
  documents: {
    type: string;
    hash: string;
  }[];
  submittedDate: string;
  status: 'pending' | 'verified' | 'rejected';
}

// Loan types
export interface Loan {
  id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  interestRate: number;
  duration: number;
  requestDate: string;
  approvalDate: string | null;
  repaymentsMade: number;
  totalRepayments: number;
}

export interface LoanRequest {
  id: number;
  userId: string;
  userName: string;
  trustScore: number;
  amount: number;
  currency: string;
  interestRate: number;
  duration: number;
  purpose: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface BlockchainLoan {
  id: string;
  borrower: string;
  lender: string;
  amount: string;
  interestRate: string;
  termDays: string;
  purpose: string;
  status: string;
  appliedDate: string;
  approvalDate: string;
  fundingDate: string;
  repaymentDeadline: string;
  amountRepaid: string;
}

export enum LoanStatusEnum {
  Applied = "0",
  UnderReview = "1",
  Approved = "2",
  Rejected = "3",
  Funded = "4",
  Repaying = "5",
  Completed = "6",
  Defaulted = "7"
}

// Transaction types
export interface Transaction {
  id: number;
  type: string;
  amount: number;
  currency: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
}

// Bank types
export interface Bank {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  usersVerified: number;
  loansProcessed: number;
  joinDate: string;
}

// User with trust score
export interface UserWithTrustScore {
  id: string;
  name: string;
  walletAddress: string;
  trustScore: number;
  kycStatus: 'pending' | 'verified' | 'rejected';
}
