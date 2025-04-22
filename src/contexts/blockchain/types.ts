
import { Contract } from "web3-eth-contract";
import Web3 from "web3";

export enum NETWORK_IDS {
  MAINNET = 1,
  GOERLI = 5,
  GANACHE = 1337,
  LOCALHOST = 1337
}

export type NetworkType = 'mainnet' | 'testnet' | 'local' | 'unknown';

export interface BlockchainContextType {
  web3: Web3 | null;
  account: string | null;
  isConnected: boolean;
  networkName: string;
  networkId: number | null; // Added networkId
  isCorrectNetwork: boolean;
  isGanache: boolean;
  isBlockchainLoading: boolean;
  connectionError: string | null;
  kycContract: Contract | null;
  trustScoreContract: Contract | null;
  loanContract: Contract | null;
  kycStatus?: 'not_verified' | 'pending' | 'verified' | 'rejected'; // Added kycStatus
  connectWallet: () => Promise<string | false>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<boolean>;
  submitKYC: (documentHash: string) => Promise<boolean>;
  verifyKYC: (kycId: string, verificationStatus: 'verified' | 'rejected') => Promise<boolean>;
  getKYCStatus: (address: string) => Promise<boolean>;
  submitLoanApplication: (loanData: any) => Promise<string | null>;
  approveLoan: (loanId: string) => Promise<boolean>;
  rejectLoan: (loanId: string) => Promise<boolean>;
  getTransactionHistory: () => Promise<any[]>;
  simulateBlockchainEvent: () => Promise<boolean | void>;
  registerBank?: (bankData: any) => Promise<boolean>; // Added registerBank
  repayLoan?: (loanId: string, amount: string) => Promise<boolean>; // Added repayLoan
}

export type TransactionType = 'kyc' | 'verification' | 'loan' | 'loan_approval' | 'loan_rejection' | 'repayment';

export interface Transaction {
  hash: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  type: TransactionType;
  description: string;
  account: string;
  network: string | number;
  metadata?: any;
}
