
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { TransactionType } from '@/utils/transactions/types';

// Define network IDs
export const NETWORK_IDS = {
  MAINNET: 1,
  GOERLI: 5,
  GANACHE: 1337,
  LOCALHOST: 31337
};

// Define network type
export type NetworkType = 'mainnet' | 'testnet' | 'local' | 'unknown';

export interface BlockchainContextType {
  account: string | null;
  isConnected: boolean;
  networkName: string;
  networkId: number | null;
  isCorrectNetwork: boolean;
  isGanache: boolean;
  isBlockchainLoading: boolean;
  connectionError: string | null;
  transactions: any[];
  web3: any;
  kycContract: Contract | null;
  trustScoreContract: Contract | null;
  loanContract: Contract | null;
  isContractsInitialized: boolean;
  kycStatus: 'not_verified' | 'pending' | 'verified' | 'rejected';
  connectWallet: () => Promise<any>;
  disconnectWallet: () => void;
  submitKYC: (documentHash: string, feeInWei?: string) => Promise<boolean>;
  getKYCStatus: (address: string) => Promise<boolean>;
  verifyKYC: (kycId: string, verificationStatus: 'verified' | 'rejected') => Promise<boolean>;
  switchNetwork: (chainId: number) => Promise<any>; 
  registerBank: (bankData: any) => Promise<boolean>;
  getTransactionHistory: () => Promise<any[]>;
  repayLoan: (loanId: string, amountInWei: string) => Promise<boolean>;
  approveLoan: (loanId: string) => Promise<boolean>;
  rejectLoan: (loanId: string, reason?: string) => Promise<boolean>;
  submitLoanApplication: (loanData: any) => Promise<string | null>;
  getUserLoans: () => Promise<any[]>;
  updateTrustScore?: (address: string, score: number) => Promise<boolean>;
  getTrustScore?: (address: string) => Promise<number>;
  clearBlockchainCache?: () => void;
  isOptimized?: boolean;
}
