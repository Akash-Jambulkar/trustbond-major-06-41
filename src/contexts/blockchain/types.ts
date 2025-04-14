
import { Contract } from "web3-eth-contract";
import Web3 from "web3";
import { Transaction } from "@/utils/transactions";

export interface BlockchainContextType {
  // Connection state
  web3: Web3 | null;
  account: string | null;
  networkId: number | null;
  isConnected: boolean;
  networkName: string;
  isCorrectNetwork: boolean;
  isGanache: boolean;
  isBlockchainLoading: boolean;
  connectionError: string | null;
  
  // Connection methods
  connectWallet: () => Promise<string>;
  disconnectWallet: () => void;
  switchNetwork: (networkId: number) => Promise<void>;
  
  // Contract instances
  kycContract: Contract | null;
  trustScoreContract: Contract | null;
  loanContract: Contract | null;
  
  // KYC operations
  submitKYC: (documentHash: string) => Promise<void>;
  verifyKYC: (userAddress: string, status: boolean) => Promise<void>;
  getKYCStatus: (userAddress: string) => Promise<boolean>;
  
  // Trust score operations
  updateTrustScore: (userAddress: string, score: number) => Promise<void>;
  getTrustScore: (userAddress: string) => Promise<number>;
  
  // Loan operations
  requestLoan: (amount: number, duration: number) => Promise<number>;
  approveLoan: (loanId: number) => Promise<void>;
  rejectLoan: (loanId: number) => Promise<void>;
  repayLoan: (loanId: number, amount: number) => Promise<void>;
  getUserLoans: (userAddress: string) => Promise<number[]>;
  
  // Transaction management
  transactions: Transaction[];
  refreshTransactions: () => void;
  
  // Bank operations
  registerBank: (name: string, registrationNumber: string, walletAddress: string) => Promise<void>;
}

export const NETWORK_IDS = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  GANACHE: 1337,
  LOCALHOST: 5777,
};

export interface ContractAddresses {
  KYC_VERIFIER: string;
  TRUST_SCORE: string;
  LOAN_MANAGER: string;
}
