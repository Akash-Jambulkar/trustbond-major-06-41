
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMode } from './ModeContext';
import { toast } from 'sonner';
import Web3 from 'web3';
import KYCVerifierABI from '@/contracts/abis/KYCVerifier.json';
import TrustScoreABI from '@/contracts/abis/TrustScore.json';
import LoanManagerABI from '@/contracts/abis/LoanManager.json';

// Define blockchain context type
interface BlockchainContextType {
  web3: Web3 | null;
  account: string | null;
  isConnected: boolean;
  networkName: string;
  isCorrectNetwork: boolean;
  isGanache: boolean;
  isBlockchainLoading: boolean;
  isContractsInitialized: boolean;
  connectionError: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  submitKYC: (documentHash: string, fee: string) => Promise<boolean>;
  switchNetwork: (chainId: number) => Promise<void>;
}

// Create blockchain context
const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

// Ethereum networks mapping
const NETWORKS: Record<number, string> = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  1337: 'Ganache',
  11155111: 'Sepolia'
};

// Smart Contract addresses (would come from environment variables in production)
const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: '0x4242424242424242424242424242424242424242',
  TRUST_SCORE: '0x4343434343434343434343434343434343434343',
  LOAN_MANAGER: '0x4444444444444444444444444444444444444444'
};

// Blockchain provider props
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

  // Contract instances
  const [kycVerifierContract, setKycVerifierContract] = useState<any>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<any>(null);
  const [loanManagerContract, setLoanManagerContract] = useState<any>(null);

  // Connect to wallet function
  const connectWallet = async () => {
    if (!enableBlockchain) return;
    
    setIsBlockchainLoading(true);
    setConnectionError(null);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install the MetaMask extension.");
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please make sure MetaMask is unlocked.");
      }
      
      // Create Web3 instance
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      
      // Get network ID
      const netId = await web3Instance.eth.net.getId();
      setNetworkId(netId);
      
      // Initialize contracts
      await initializeContracts(web3Instance);

      toast.success("Connected to wallet successfully!");
    } catch (error: any) {
      console.error("Error connecting to wallet:", error);
      
      // Extract meaningful error messages from different error formats
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

  // Disconnect wallet function
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

  // Initialize smart contracts
  const initializeContracts = async (web3Instance: Web3) => {
    try {
      // For development, you might want to detect if we're on a test network and use different addresses
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

  // Submit KYC document hash to blockchain
  const submitKYC = async (documentHash: string, fee: string): Promise<boolean> => {
    if (!web3 || !account || !isContractsInitialized || !kycVerifierContract) {
      toast.error("Blockchain connection not initialized");
      return false;
    }
    
    try {
      // This would be a real contract call in production
      // For demo, we're just simulating the success scenario
      console.log(`Submitting KYC with hash: ${documentHash} and fee: ${fee}`);
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      toast.success("KYC document submitted to blockchain");
      return true;
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC document to blockchain");
      return false;
    }
  };

  // Switch Ethereum network
  const switchNetwork = async (chainId: number) => {
    if (!web3 || !window.ethereum) {
      toast.error("Blockchain connection not initialized");
      return;
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      
      // Update network ID after switch
      const web3Instance = new Web3(window.ethereum);
      const netId = await web3Instance.eth.net.getId();
      setNetworkId(netId);
      
      toast.success(`Switched to ${NETWORKS[chainId] || 'Unknown Network'}`);
    } catch (error: any) {
      console.error("Error switching network:", error);
      
      // Handle the case where the chain is not added to MetaMask
      if (error.code === 4902) {
        toast.error("This network is not available in your MetaMask. Please add it manually.");
      } else {
        toast.error("Failed to switch network");
      }
    }
  };

  // Auto-connect to MetaMask if previously connected and blockchain is enabled
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

  // Setup event listeners for account and network changes
  useEffect(() => {
    if (window.ethereum && enableBlockchain) {
      // Account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else if (accounts[0] !== account) {
          // Account changed
          setAccount(accounts[0]);
          toast.info(`Switched to account: ${accounts[0].substring(0, 8)}...`);
        }
      };
      
      // Network changes
      const handleChainChanged = (chainIdHex: string) => {
        const chainId = parseInt(chainIdHex, 16);
        setNetworkId(chainId);
        toast.info(`Network changed to ${NETWORKS[chainId] || 'Unknown Network'}`);
        // Refresh the page to ensure all state is updated correctly
        window.location.reload();
      };
      
      // Add event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Remove event listeners on cleanup
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [account, enableBlockchain]);

  // Computed values
  const isConnected = !!account;
  const networkName = networkId ? (NETWORKS[networkId] || 'Unknown Network') : 'Not Connected';
  const isCorrectNetwork = networkId === 1 || networkId === 5 || networkId === 1337; // Mainnet, Goerli or Ganache
  const isGanache = networkId === 1337;

  // Context value
  const value = {
    web3,
    account,
    isConnected,
    networkName,
    isCorrectNetwork,
    isGanache,
    isBlockchainLoading,
    isContractsInitialized,
    connectionError,
    connectWallet,
    disconnectWallet,
    submitKYC,
    switchNetwork
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

// Custom hook to use blockchain context
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  
  return context;
};
