import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMode } from './ModeContext';
import { toast } from 'sonner';
import Web3 from 'web3';
import KYCVerifierABI from '@/contracts/abis/KYCVerifier.json';
import TrustScoreABI from '@/contracts/abis/TrustScore.json';
import LoanManagerABI from '@/contracts/abis/LoanManager.json';
import { CONTRACT_ADDRESSES } from '@/utils/contracts/contractConfig';

interface BlockchainContextType {
  web3: Web3 | null;
  account: string | null;
  isConnected: boolean;
  networkId: number | null;
  networkName: string;
  isCorrectNetwork: boolean;
  isGanache: boolean;
  isBlockchainLoading: boolean;
  isContractsInitialized: boolean;
  connectionError: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  submitKYC: (documentHash: string, fee: string) => Promise<boolean>;
  getKYCStatus: (address: string) => Promise<boolean>;
  verifyKYC: (kycId: string, verificationStatus: 'verified' | 'rejected') => Promise<boolean>;
  getTransactionHistory: () => Promise<any[]>;
  registerBank: (bankData: any) => Promise<boolean>;
  repayLoan: (loanId: string, amountInWei: string) => Promise<boolean>;
  approveLoan: (loanId: string) => Promise<boolean>;
  rejectLoan: (loanId: string, reason?: string) => Promise<boolean>;
  submitLoanApplication: (loanData: any) => Promise<string | null>;
  getUserLoans: () => Promise<any[]>;
  updateTrustScore: (address: string, score: number) => Promise<boolean>;
  getTrustScore: (address: string) => Promise<number>;
  switchNetwork: (chainId: number) => Promise<boolean>;
  kycStatus: 'not_verified' | 'pending' | 'verified' | 'rejected';
  kycContract: any;
  trustScoreContract: any;
  loanContract: any;
  transactions: any[];
  clearBlockchainCache?: () => void;
  isOptimized?: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

const NETWORKS: Record<number, string> = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  1337: 'Ganache',
  11155111: 'Sepolia'
};

const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: '0x4242424242424242424242424242424242424242',
  TRUST_SCORE: '0x4343434343434343434343434343434343434343',
  LOAN_MANAGER: '0x4444444444444444444444444444444444444444'
};

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const { enableBlockchain } = useMode();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState<boolean>(false);
  const [isContractsInitialized, setIsContractsInitialized] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isOptimized, setIsOptimized] = useState<boolean>(true);

  const [kycVerifierContract, setKycVerifierContract] = useState<any>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<any>(null);
  const [loanContract, setLoanManagerContract] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<'not_verified' | 'pending' | 'verified' | 'rejected'>('not_verified');

  const connectWallet = async () => {
    if (!enableBlockchain) return;
    
    setIsBlockchainLoading(true);
    setConnectionError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install the MetaMask extension.");
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please make sure MetaMask is unlocked.");
      }
      
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      
      const netId = await web3Instance.eth.net.getId();
      setNetworkId(netId);
      
      await initializeContracts(web3Instance);

      toast.success("Connected to wallet successfully!");
    } catch (error: any) {
      console.error("Error connecting to wallet:", error);
      
      let errorMessage: string;

      if (error?.code === 4001) {
        errorMessage = "Connection rejected. Please approve the MetaMask connection request.";
      } else if (error?.code === -32002) {
        errorMessage = "Connection already pending. Please open MetaMask to continue.";
      } else if (error?.message) {
        errorMessage = error.message;
      } else {
        errorMessage = "Failed to connect to MetaMask. Please try again.";
      }
      
      setConnectionError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsBlockchainLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setNetworkId(null);
    setIsContractsInitialized(false);
    setKycVerifierContract(null);
    setTrustScoreContract(null);
    setLoanManagerContract(null);
    toast.info("Wallet disconnected");
  };

  const initializeContracts = async (web3Instance: Web3) => {
    try {
      const kycVerifier = new web3Instance.eth.Contract(
        KYCVerifierABI as any,
        CONTRACT_ADDRESSES.KYC_VERIFIER
      );
      
      const trustScore = new web3Instance.eth.Contract(
        TrustScoreABI as any,
        CONTRACT_ADDRESSES.TRUST_SCORE
      );
      
      const loanManager = new web3Instance.eth.Contract(
        LoanManagerABI as any,
        CONTRACT_ADDRESSES.LOAN_MANAGER
      );
      
      setKycVerifierContract(kycVerifier);
      setTrustScoreContract(trustScore);
      setLoanManagerContract(loanManager);
      setIsContractsInitialized(true);
      
      console.log("Smart contracts initialized successfully");
    } catch (error) {
      console.error("Error initializing contracts:", error);
      toast.error("Failed to initialize blockchain contracts");
      setIsContractsInitialized(false);
    }
  };

  const submitKYC = async (documentHash: string, fee: string): Promise<boolean> => {
    if (!web3 || !account || !isContractsInitialized || !kycVerifierContract) {
      toast.error("Blockchain connection not initialized");
      return false;
    }
    
    try {
      console.log(`Submitting KYC with hash: ${documentHash} and fee: ${fee}`);
      
      const transaction = await web3.eth.sendTransaction({
        from: account,
        to: CONTRACT_ADDRESSES.KYC_VERIFIER,
        value: fee,
        data: kycVerifierContract.methods.submitKYC(documentHash).encodeABI(),
        gas: 200000
      });
      
      console.log("KYC transaction hash:", transaction.transactionHash);
      
      const newTransaction = {
        id: Date.now().toString(),
        hash: transaction.transactionHash,
        type: 'KYC Submission',
        status: 'confirmed',
        timestamp: new Date().getTime()
      };
      setTransactions([newTransaction, ...transactions]);
      
      toast.success("KYC document submitted to blockchain with fee");
      return true;
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error(`Failed to submit KYC document to blockchain: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const getKYCStatus = async (address: string): Promise<boolean> => {
    if (!web3 || !kycVerifierContract || !isContractsInitialized) {
      return false;
    }
    try {
      const status = await kycVerifierContract.methods.getKYCStatus(address).call();
      return status;
    } catch (error) {
      console.error("Error getting KYC status:", error);
      return false;
    }
  };

  const verifyKYC = async (kycId: string, verificationStatus: 'verified' | 'rejected'): Promise<boolean> => {
    if (!web3 || !account || !kycVerifierContract || !isContractsInitialized) {
      toast.error("Blockchain connection not initialized");
      return false;
    }
    
    try {
      const isApproved = verificationStatus === 'verified';
      await kycVerifierContract.methods.verifyKYC(kycId, isApproved).send({ from: account });
      toast.success(`KYC ${verificationStatus} successfully`);
      return true;
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error(`Failed to ${verificationStatus} KYC document`);
      return false;
    }
  };

  const getTransactionHistory = async (): Promise<any[]> => {
    return [
      {
        id: '1',
        hash: '0x123...abc',
        type: 'KYC Submission',
        status: 'confirmed',
        timestamp: new Date().getTime() - 3600000
      },
      {
        id: '2',
        hash: '0x456...def',
        type: 'Loan Request',
        status: 'pending',
        timestamp: new Date().getTime() - 7200000
      }
    ];
  };

  const registerBank = async (bankData: any): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Bank registration submitted to blockchain");
      return true;
    } catch (error) {
      console.error("Error registering bank:", error);
      toast.error("Failed to register bank on blockchain");
      return false;
    }
  };

  const repayLoan = async (loanId: string, amountInWei: string): Promise<boolean> => {
    if (!web3 || !account || !loanContract || !isContractsInitialized) {
      toast.error("Blockchain connection not initialized");
      return false;
    }
    
    try {
      await loanContract.methods.repayLoan(loanId, amountInWei).send({ 
        from: account, 
        value: amountInWei 
      });
      
      toast.success("Loan repayment successful");
      return true;
    } catch (error) {
      console.error("Error repaying loan:", error);
      toast.error("Loan repayment failed");
      return false;
    }
  };

  const approveLoan = async (loanId: string): Promise<boolean> => {
    if (!web3 || !account || !loanContract || !isContractsInitialized) {
      toast.error("Blockchain connection not initialized");
      return false;
    }
    
    try {
      await loanContract.methods.approveLoan(loanId, 5).send({ from: account });
      
      toast.success("Loan approved successfully");
      return true;
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan");
      return false;
    }
  };

  const rejectLoan = async (loanId: string, reason: string = "Application rejected"): Promise<boolean> => {
    if (!web3 || !account || !loanContract || !isContractsInitialized) {
      toast.error("Blockchain connection not initialized");
      return false;
    }
    
    try {
      await loanContract.methods.rejectLoan(loanId).send({ from: account });
      
      toast.success("Loan rejected successfully");
      return true;
    } catch (error) {
      console.error("Error rejecting loan:", error);
      toast.error("Failed to reject loan");
      return false;
    }
  };

  const submitLoanApplication = async (loanData: any): Promise<string | null> => {
    if (!web3 || !account || !loanContract || !isContractsInitialized) {
      toast.error("Blockchain connection not initialized");
      return null;
    }
    
    try {
      const { amount, purpose, termMonths } = loanData;
      const amountWei = web3.utils.toWei(amount.toString(), 'ether');
      
      const loanId = await loanContract.methods
        .requestLoan(amountWei, purpose || 'General', termMonths || 12)
        .send({ from: account });
        
      toast.success("Loan application submitted successfully");
      return loanId;
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast.error("Failed to submit loan application");
      return null;
    }
  };

  const getUserLoans = async (): Promise<any[]> => {
    if (!web3 || !account || !loanContract || !isContractsInitialized) {
      return [];
    }
    
    try {
      const loanIds = await loanContract.methods.getUserLoans(account).call();
      
      const loans = await Promise.all(
        loanIds.map(async (id: string) => {
          const loan = await loanContract.methods.getLoan(id).call();
          return loan;
        })
      );
      
      return loans;
    } catch (error) {
      console.error("Error fetching user loans:", error);
      return [];
    }
  };

  const updateTrustScore = async (address: string, score: number): Promise<boolean> => {
    if (!web3 || !account || !trustScoreContract || !isContractsInitialized) {
      toast.error("Blockchain connection not initialized");
      return false;
    }
    
    try {
      await trustScoreContract.methods.updateScore(address, score).send({ from: account });
      
      toast.success("Trust score updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating trust score:", error);
      toast.error("Failed to update trust score");
      return false;
    }
  };

  const getTrustScore = async (address: string): Promise<number> => {
    if (!web3 || !trustScoreContract || !isContractsInitialized) {
      return 0;
    }
    
    try {
      const score = await trustScoreContract.methods.calculateScore(address).call();
      return parseInt(score);
    } catch (error) {
      console.error("Error getting trust score:", error);
      return 0;
    }
  };

  const switchNetwork = async (chainId: number): Promise<boolean> => {
    if (!web3 || !window.ethereum) {
      toast.error("Blockchain connection not initialized");
      return false;
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      
      const web3Instance = new Web3(window.ethereum);
      const netId = await web3Instance.eth.net.getId();
      setNetworkId(netId);
      
      toast.success(`Switched to ${NETWORKS[chainId] || 'Unknown Network'}`);
      return true;
    } catch (error: any) {
      console.error("Error switching network:", error);
      
      if (error.code === 4902) {
        toast.error("This network is not available in your MetaMask. Please add it manually.");
      } else {
        toast.error("Failed to switch network");
      }
      return false;
    }
  };

  const clearBlockchainCache = () => {
    disconnectWallet();
    setTransactions([]);
    setKycStatus('not_verified');
    localStorage.removeItem('blockchain_account');
    localStorage.removeItem('blockchain_tx_history');
    toast.success("Blockchain cache cleared");
  };

  useEffect(() => {
    if (enableBlockchain) {
      const checkConnection = async () => {
        if (window.ethereum) {
          try {
            const web3Instance = new Web3(window.ethereum);
            const accounts = await web3Instance.eth.getAccounts();
            
            if (accounts.length > 0) {
              setWeb3(web3Instance);
              setAccount(accounts[0]);
              
              const netId = await web3Instance.eth.net.getId();
              setNetworkId(netId);
              
              await initializeContracts(web3Instance);
            }
          } catch (error) {
            console.error("Error auto-connecting to wallet:", error);
          }
        }
      };
      
      checkConnection();
    }
  }, [enableBlockchain]);

  useEffect(() => {
    if (window.ethereum && enableBlockchain) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          toast.info(`Switched to account: ${accounts[0].substring(0, 8)}...`);
        }
      };
      
      const handleChainChanged = (chainIdHex: string) => {
        const chainId = parseInt(chainIdHex, 16);
        setNetworkId(chainId);
        toast.info(`Network changed to ${NETWORKS[chainId] || 'Unknown Network'}`);
        window.location.reload();
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [account, enableBlockchain]);

  const isConnected = !!account;
  const networkName = networkId ? (NETWORKS[networkId] || 'Unknown Network') : 'Not Connected';
  const isCorrectNetwork = networkId === 1 || networkId === 5 || networkId === 1337;
  const isGanache = networkId === 1337;

  const value: BlockchainContextType = {
    web3,
    account,
    isConnected,
    networkId,
    networkName,
    isCorrectNetwork,
    isGanache,
    isBlockchainLoading,
    isContractsInitialized,
    connectionError,
    kycContract: kycVerifierContract,
    trustScoreContract,
    loanContract,
    kycStatus,
    transactions,
    connectWallet,
    disconnectWallet,
    submitKYC,
    getKYCStatus,
    verifyKYC,
    switchNetwork,
    getTransactionHistory,
    registerBank,
    repayLoan,
    approveLoan,
    rejectLoan,
    submitLoanApplication,
    getUserLoans,
    updateTrustScore,
    getTrustScore,
    clearBlockchainCache,
    isOptimized
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  
  return context;
};
