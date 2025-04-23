
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
  isContractsInitialized?: boolean;
  kycStatus?: string; // Added for LoanApplicationPage
  connectWallet: () => Promise<string | false>;
  disconnectWallet: () => void;
  submitKYC: (documentHash: string, feeInWei?: string) => Promise<boolean>;
  getKYCStatus: (address: string) => Promise<boolean>;
  verifyKYC?: (address: string, approved: boolean) => Promise<boolean>;
  switchNetwork?: (networkId: number) => Promise<boolean>; // Added for WalletStatus
  registerBank?: (bankData: any) => Promise<boolean>; // Added for BankRegistrationForm
  getTransactionHistory?: () => Promise<any[]>; // Added for TransactionHistory
  repayLoan?: (loanId: string, amountInWei: string) => Promise<boolean>; // Added for LoanRepaymentTracker
  approveLoan?: (loanId: string) => Promise<boolean>; // Added for BankVerification
  rejectLoan?: (loanId: string) => Promise<boolean>; // Added for BankVerification
  submitLoanApplication?: (loanData: any) => Promise<string | null>; // Added for BankVerification
}
