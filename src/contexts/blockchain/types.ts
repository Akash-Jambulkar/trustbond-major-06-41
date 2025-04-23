
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { TransactionType } from '@/utils/transactions/types';

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
  isContractsInitialized?: boolean; // Added this property
  connectWallet: () => Promise<string | false>;
  disconnectWallet: () => void;
  submitKYC: (documentHash: string, feeInWei?: string) => Promise<boolean>; // Made feeInWei optional
  getKYCStatus: (address: string) => Promise<boolean>;
  verifyKYC?: (address: string, approved: boolean) => Promise<boolean>; // Added this method
}
