
import { Contract } from "web3-eth-contract";
import Web3 from "web3";

export interface BlockchainContextType {
  web3: Web3 | null;
  account: string | null;
  networkId: number | null;
  networkName: string;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isGanache: boolean;
  isBlockchainLoading: boolean;
  connectionError: string | null;
  transactions: any[];
  kycContract: Contract | null;
  trustScoreContract: Contract | null;
  loanContract: Contract | null;
  isContractsInitialized: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'not_verified';
  connectWallet: () => Promise<string | false>;
  disconnectWallet: () => void;
  submitKYC: (documentHash: string, feeInWei?: string) => Promise<boolean>;
  getKYCStatus: (address: string) => Promise<boolean>;
  verifyKYC: (kycId: string, verificationStatus: 'verified' | 'rejected') => Promise<boolean>;
  getTransactionHistory: () => Promise<any[]>;
  switchNetwork: (chainId: number) => Promise<boolean>;
  registerBank: (bankData: any) => Promise<boolean>;
  repayLoan: (loanId: string, amountInWei: string) => Promise<boolean>;
  approveLoan: (loanId: string) => Promise<boolean>;
  rejectLoan: (loanId: string) => Promise<boolean>;
  submitLoanApplication: (loanData: any) => Promise<string | null>;
  updateTrustScore: (userAddress: string, score: number) => Promise<boolean>;
  getTrustScore: (userAddress?: string) => Promise<number>;
  getUserLoans: (userAddress?: string) => Promise<any[]>;
  // New functions for caching
  clearBlockchainCache: () => void;
  isOptimized: boolean;
}
