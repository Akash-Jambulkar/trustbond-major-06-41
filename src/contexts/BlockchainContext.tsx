
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Web3 from 'web3';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { useMode } from './ModeContext';

// ABI imports for your contracts
import KYCVerifierABI from '../contracts/KYCVerifier.json';
import TrustScoreABI from '../contracts/TrustScore.json';
import LoanManagerABI from '../contracts/LoanManager.json';

// Define the types for the context
interface BlockchainContextType {
  web3: Web3 | null;
  account: string | null;
  networkId: number | null;
  networkName: string;
  isConnected: boolean;
  isGanache: boolean;
  isCorrectNetwork: boolean;
  isBlockchainLoading: boolean;
  isContractsInitialized: boolean;
  connectionError: string | null;
  kycContract: any;
  trustScoreContract: any;
  loanContract: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  submitKYC: (documentHash: string, verificationFee: string) => Promise<any>;
  verifyKYC: (userAddress: string, documentHash: string) => Promise<any>;
  getLoanDetails: (loanId: string) => Promise<any>;
  applyForLoan: (amount: string, duration: number, purpose: string) => Promise<any>;
  approveLoan: (loanId: string) => Promise<any>;
  rejectLoan: (loanId: string, reason: string) => Promise<any>;
}

// Create the context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  web3: null,
  account: null,
  networkId: null,
  networkName: '',
  isConnected: false,
  isGanache: false,
  isCorrectNetwork: false,
  isBlockchainLoading: false,
  isContractsInitialized: false,
  connectionError: null,
  kycContract: null,
  trustScoreContract: null,
  loanContract: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  switchNetwork: async () => {},
  submitKYC: async () => null,
  verifyKYC: async () => null,
  getLoanDetails: async () => null,
  applyForLoan: async () => null,
  approveLoan: async () => null,
  rejectLoan: async () => null,
});

// Contract addresses - in a real app these would come from environment variables or deployment files
const CONTRACT_ADDRESSES = {
  KYCVerifier: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  TrustScore: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  LoanManager: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
};

// Supported networks
const SUPPORTED_NETWORKS = [1, 5, 1337]; // Ethereum Mainnet, Goerli, Ganache

// Network names
const NETWORK_NAMES: { [key: number]: string } = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  1337: 'Ganache (Local)'
};

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { enableBlockchain } = useMode();
  const { user, isAuthenticated } = useAuth();
  
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [kycContract, setKycContract] = useState<any>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<any>(null);
  const [loanContract, setLoanContract] = useState<any>(null);
  const [isContractsInitialized, setIsContractsInitialized] = useState(false);
  
  // Store the last connected account in local storage for persistence
  const storeLastConnectedAccount = (account: string) => {
    localStorage.setItem('lastConnectedAccount', account);
  };
  
  // Get the last connected account from local storage
  const getLastConnectedAccount = (): string | null => {
    return localStorage.getItem('lastConnectedAccount');
  };

  // Clear the stored account on disconnect
  const clearStoredAccount = () => {
    localStorage.removeItem('lastConnectedAccount');
  };
  
  // Check if MetaMask is installed
  const checkIfMetaMaskInstalled = (): boolean => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Initialize the contracts
  const initializeContracts = async (web3Instance: Web3) => {
    if (!web3Instance) return false;
    
    try {
      const kycVerifierContract = new web3Instance.eth.Contract(
        KYCVerifierABI.abi,
        CONTRACT_ADDRESSES.KYCVerifier
      );
      
      const trustScoreContract = new web3Instance.eth.Contract(
        TrustScoreABI.abi,
        CONTRACT_ADDRESSES.TrustScore
      );
      
      const loanManagerContract = new web3Instance.eth.Contract(
        LoanManagerABI.abi,
        CONTRACT_ADDRESSES.LoanManager
      );
      
      setKycContract(kycVerifierContract);
      setTrustScoreContract(trustScoreContract);
      setLoanContract(loanManagerContract);
      setIsContractsInitialized(true);
      
      return true;
    } catch (error) {
      console.error("Failed to initialize contracts:", error);
      return false;
    }
  };
  
  // Connect to MetaMask
  const connectWallet = async (): Promise<void> => {
    setIsBlockchainLoading(true);
    setConnectionError(null);
    
    try {
      if (!checkIfMetaMaskInstalled()) {
        throw new Error("MetaMask is not installed. Please install MetaMask and try again.");
      }
      
      // Prompt user to connect their wallet
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const selectedAccount = accounts[0];
      
      // Get the network ID
      const web3Instance = new Web3(window.ethereum);
      const networkId = await web3Instance.eth.net.getId();
      
      setWeb3(web3Instance);
      setAccount(selectedAccount);
      setNetworkId(networkId);
      
      // Store the connected account
      storeLastConnectedAccount(selectedAccount);
      
      // Initialize the contracts
      await initializeContracts(web3Instance);
      
      toast.success("Connected to MetaMask successfully");
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error);
      setConnectionError(error.message || "Failed to connect to MetaMask");
      toast.error("Failed to connect to MetaMask");
      throw error;
    } finally {
      setIsBlockchainLoading(false);
    }
  };
  
  // Disconnect from MetaMask
  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setNetworkId(null);
    setIsContractsInitialized(false);
    clearStoredAccount();
    toast.info("Disconnected from MetaMask");
  };
  
  // Switch network
  const switchNetwork = async (chainId: number): Promise<void> => {
    if (!web3 || !window.ethereum) {
      toast.error("MetaMask is not connected");
      return;
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      
      // Network will be updated via the chainChanged event listener
      toast.success(`Switched to ${NETWORK_NAMES[chainId] || 'network'}`);
    } catch (error: any) {
      console.error("Error switching network:", error);
      toast.error(`Failed to switch network: ${error.message}`);
    }
  };
  
  // Setup event listeners for MetaMask events
  const setupEventListeners = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Handle account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          // User switched accounts
          setAccount(accounts[0]);
          storeLastConnectedAccount(accounts[0]);
          toast.info("Account switched in MetaMask");
        }
      });
      
      // Handle network changes
      window.ethereum.on('chainChanged', (chainIdHex: string) => {
        // Parse the chain ID from hex to decimal
        const newChainId = parseInt(chainIdHex, 16);
        setNetworkId(newChainId);
        toast.info(`Network changed to ${NETWORK_NAMES[newChainId] || 'Unknown Network'}`);
        
        // Re-initialize contracts on network change
        if (web3) {
          initializeContracts(web3);
        }
      });
      
      // Handle disconnect event
      window.ethereum.on('disconnect', () => {
        disconnectWallet();
      });
    }
  };

  // Clean up event listeners
  const cleanupEventListeners = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
      window.ethereum.removeAllListeners('disconnect');
    }
  };
  
  // Auto-connect to MetaMask if previously connected
  const autoConnectWallet = async () => {
    const lastAccount = getLastConnectedAccount();
    
    if (lastAccount && checkIfMetaMaskInstalled()) {
      setIsBlockchainLoading(true);
      try {
        const web3Instance = new Web3(window.ethereum);
        // Check if we're still authorized - this won't prompt if we are
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          const networkId = await web3Instance.eth.net.getId();
          
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setNetworkId(networkId);
          
          await initializeContracts(web3Instance);
          console.log("Auto-connected to MetaMask with account:", accounts[0]);
        } else {
          // We were previously connected but no longer authorized
          clearStoredAccount();
        }
      } catch (error) {
        console.error("Error auto-connecting to MetaMask:", error);
        clearStoredAccount();
      } finally {
        setIsBlockchainLoading(false);
      }
    }
  };
  
  // Submit KYC document hash to the blockchain
  const submitKYC = async (documentHash: string, verificationFee: string): Promise<any> => {
    if (!web3 || !account || !kycContract) {
      toast.error("Blockchain connection not available");
      return null;
    }
    
    try {
      const result = await kycContract.methods.submitKYC(documentHash).send({
        from: account,
        value: verificationFee
      });
      
      toast.success("KYC document submitted successfully");
      return result;
    } catch (error: any) {
      console.error("Error submitting KYC:", error);
      toast.error(`Failed to submit KYC: ${error.message}`);
      return null;
    }
  };
  
  // Verify a user's KYC document (bank function)
  const verifyKYC = async (userAddress: string, documentHash: string): Promise<any> => {
    if (!web3 || !account || !kycContract) {
      toast.error("Blockchain connection not available");
      return null;
    }
    
    try {
      const result = await kycContract.methods.verifyKYC(userAddress, documentHash).send({
        from: account
      });
      
      toast.success("KYC document verified successfully");
      return result;
    } catch (error: any) {
      console.error("Error verifying KYC:", error);
      toast.error(`Failed to verify KYC: ${error.message}`);
      return null;
    }
  };
  
  // Get loan details from the blockchain
  const getLoanDetails = async (loanId: string): Promise<any> => {
    if (!web3 || !loanContract) {
      toast.error("Blockchain connection not available");
      return null;
    }
    
    try {
      const result = await loanContract.methods.getLoan(loanId).call();
      return result;
    } catch (error: any) {
      console.error("Error getting loan details:", error);
      toast.error(`Failed to get loan details: ${error.message}`);
      return null;
    }
  };
  
  // Apply for a loan
  const applyForLoan = async (amount: string, duration: number, purpose: string): Promise<any> => {
    if (!web3 || !account || !loanContract) {
      toast.error("Blockchain connection not available");
      return null;
    }
    
    try {
      // Convert amount to Wei
      const amountInWei = web3.utils.toWei(amount, 'ether');
      
      const result = await loanContract.methods.applyForLoan(amountInWei, duration, purpose).send({
        from: account
      });
      
      toast.success("Loan application submitted successfully");
      return result;
    } catch (error: any) {
      console.error("Error applying for loan:", error);
      toast.error(`Failed to apply for loan: ${error.message}`);
      return null;
    }
  };
  
  // Approve a loan (bank function)
  const approveLoan = async (loanId: string): Promise<any> => {
    if (!web3 || !account || !loanContract) {
      toast.error("Blockchain connection not available");
      return null;
    }
    
    try {
      const result = await loanContract.methods.approveLoan(loanId).send({
        from: account
      });
      
      toast.success("Loan approved successfully");
      return result;
    } catch (error: any) {
      console.error("Error approving loan:", error);
      toast.error(`Failed to approve loan: ${error.message}`);
      return null;
    }
  };
  
  // Reject a loan (bank function)
  const rejectLoan = async (loanId: string, reason: string): Promise<any> => {
    if (!web3 || !account || !loanContract) {
      toast.error("Blockchain connection not available");
      return null;
    }
    
    try {
      const result = await loanContract.methods.rejectLoan(loanId, reason).send({
        from: account
      });
      
      toast.success("Loan rejected successfully");
      return result;
    } catch (error: any) {
      console.error("Error rejecting loan:", error);
      toast.error(`Failed to reject loan: ${error.message}`);
      return null;
    }
  };

  // Effect to set up event listeners
  useEffect(() => {
    if (enableBlockchain) {
      setupEventListeners();
      
      // Attempt to auto-connect if we have a stored account
      autoConnectWallet();
    }
    
    // Clean up event listeners when component unmounts
    return () => {
      cleanupEventListeners();
    };
  }, [enableBlockchain]);
  
  // Effect to re-establish connection when authentication state changes
  useEffect(() => {
    // If user has just logged in and blockchain is enabled, try to connect
    if (isAuthenticated && enableBlockchain && !account) {
      const lastAccount = getLastConnectedAccount();
      if (lastAccount) {
        autoConnectWallet();
      }
    }
  }, [isAuthenticated, enableBlockchain]);

  // Derived values
  const networkName = networkId ? NETWORK_NAMES[networkId] || 'Unknown Network' : 'Not Connected';
  const isConnected = !!account && !!web3;
  const isGanache = networkId === 1337;
  const isCorrectNetwork = networkId !== null && SUPPORTED_NETWORKS.includes(networkId);
  
  const contextValue = {
    web3,
    account,
    networkId,
    networkName,
    isConnected,
    isGanache,
    isCorrectNetwork,
    isBlockchainLoading,
    isContractsInitialized,
    connectionError,
    kycContract,
    trustScoreContract,
    loanContract,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    submitKYC,
    verifyKYC,
    getLoanDetails,
    applyForLoan,
    approveLoan,
    rejectLoan
  };
  
  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => useContext(BlockchainContext);
