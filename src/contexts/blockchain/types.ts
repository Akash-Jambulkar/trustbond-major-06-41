
// Network IDs
export const NETWORK_IDS = {
  MAINNET: 1,
  GOERLI: 5,
  SEPOLIA: 11155111,
  GANACHE: 1337,
  LOCALHOST: 31337,
  // Legacy networks (deprecated but might be referenced in old code)
  ROPSTEN: 3,
  RINKEBY: 4,
  KOVAN: 42
} as const;

export type NetworkName = 
  | "Ethereum Mainnet"
  | "Goerli Testnet"
  | "Sepolia Testnet"
  | "Local Network"
  | "Unknown Network"
  | "Unknown"
  | "Ropsten Testnet (Deprecated)"
  | "Rinkeby Testnet (Deprecated)"
  | "Kovan Testnet (Deprecated)";

export interface BlockchainContextType {
  // Connection state
  account: string | null;
  isConnected: boolean;
  networkName: string;
  isCorrectNetwork: boolean;
  isGanache: boolean;
  isBlockchainLoading: boolean;
  connectionError: string | null;
  networkId?: number;
  web3?: any;
  
  // Smart contracts
  kycContract?: any;
  trustScoreContract?: any;
  loanContract?: any;
  
  // Connection functions
  connectWallet: () => Promise<string | false>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<boolean>;
  
  // KYC functions
  submitKYC: (documentHash: string) => Promise<boolean>;
  verifyKYC: (kycId: string, verificationStatus: 'verified' | 'rejected') => Promise<boolean>;
  getKYCStatus: (address: string) => Promise<boolean>;
  
  // Loan functions
  submitLoanApplication: (loanData: any) => Promise<string | null>;
  approveLoan: (loanId: string) => Promise<boolean>;
  rejectLoan: (loanId: string) => Promise<boolean>;
  repayLoan?: (loanId: string, amount: number) => Promise<boolean>;
  
  // Bank functions
  registerBank?: (bankData: any) => Promise<boolean>;
  
  // Transaction functions
  getTransactionHistory: () => Promise<any[]>;
  refreshTransactions?: () => void;
  transactions?: any[];
  
  // Development functions
  simulateBlockchainEvent: () => Promise<void>;
}
