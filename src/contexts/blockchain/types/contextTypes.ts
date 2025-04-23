
export interface BlockchainContextType {
  web3: any;
  account: string | null;
  networkId: number | null;
  networkName: string;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isGanache: boolean;
  isBlockchainLoading: boolean;
  connectionError: string | null;
  kycContract: any;
  trustScoreContract: any;
  loanContract: any;
  kycStatus: 'not_verified' | 'pending' | 'verified' | 'rejected';
  transactions: any[];

  // Functions
  connectWallet: () => Promise<string | false>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<boolean>;
  submitKYC: (documentHash: string, feeInWei?: string) => Promise<boolean>;
  verifyKYC: (kycId: string, verificationStatus: 'verified' | 'rejected') => Promise<boolean>;
  getKYCStatus: (address: string) => Promise<boolean>;
  submitLoanApplication: (loanData: any) => Promise<string | null>;
  approveLoan: (loanId: string) => Promise<boolean>;
  rejectLoan: (loanId: string) => Promise<boolean>;
  getTransactionHistory: () => Promise<any[]>;
  repayLoan: (loanId: string, amountInWei: string) => Promise<boolean>;
  registerBank: (bankData: any) => Promise<boolean>;
}
