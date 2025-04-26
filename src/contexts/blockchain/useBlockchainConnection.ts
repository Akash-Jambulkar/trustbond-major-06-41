
import { useState, useEffect, useCallback } from 'react';
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { toast } from "sonner";
import { AbiItem } from 'web3-utils';
import TrustScoreABI from "../../contracts/TrustScore.json";
import KYCVerifierABI from "../../contracts/KYCVerifier.json";
import LoanManagerABI from "../../contracts/LoanManager.json";
import { CONTRACT_ADDRESSES, getNetworkName } from './networkUtils';
import { NETWORK_IDS } from './types';

interface UseBlockchainConnectionProps {
  enableBlockchain: boolean;
}

export const useBlockchainConnection = ({ enableBlockchain }: UseBlockchainConnectionProps) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [kycContract, setKycContract] = useState<Contract | null>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<Contract | null>(null);
  const [loanContract, setLoanContract] = useState<Contract | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [contractInitialized, setContractInitialized] = useState(false);

  const networkName = getNetworkName(networkId);
  const isGanache = networkId === NETWORK_IDS.GANACHE || networkId === NETWORK_IDS.LOCALHOST;
  const isCorrectNetwork = import.meta.env.MODE === 'development' 
    ? (networkId === NETWORK_IDS.GANACHE || networkId === NETWORK_IDS.LOCALHOST)
    : (networkId !== null && networkId !== NETWORK_IDS.GANACHE && networkId !== NETWORK_IDS.LOCALHOST);
  const isConnected = !!account;

  // Initialize smart contracts when connected
  useEffect(() => {
    const initializeContracts = async () => {
      if (!web3 || !account || contractInitialized) return;
      
      console.log("Attempting to initialize smart contracts...");
      
      try {
        // Create a local web3 instance to avoid potential issues with the existing one
        const localWeb3 = new Web3(web3.currentProvider);
        
        // Initialize KYC contract
        const kyc = new localWeb3.eth.Contract(
          KYCVerifierABI.abi as AbiItem[],
          CONTRACT_ADDRESSES.KYC_VERIFIER
        );
        setKycContract(kyc);
        
        // Initialize TrustScore contract
        const trustScore = new localWeb3.eth.Contract(
          TrustScoreABI.abi as AbiItem[],
          CONTRACT_ADDRESSES.TRUST_SCORE
        );
        setTrustScoreContract(trustScore);
        
        // Initialize Loan contract
        const loan = new localWeb3.eth.Contract(
          LoanManagerABI.abi as AbiItem[],
          CONTRACT_ADDRESSES.LOAN_MANAGER
        );
        setLoanContract(loan);
        
        console.log("Smart contracts initialized successfully");
        setContractInitialized(true);
      } catch (error) {
        console.error("Failed to initialize contracts:", error);
        toast.error("Failed to initialize smart contracts. Please try again.");
        setContractInitialized(false);
      }
    };

    initializeContracts();
  }, [web3, account, networkId, contractInitialized]);

  // Check for existing connection with retries
  useEffect(() => {
    if (!enableBlockchain || initializationAttempted) {
      return;
    }
    
    const maxRetries = 3;
    let retryCount = 0;
    
    const checkConnection = async () => {
      if (!window.ethereum) {
        console.log("MetaMask not detected");
        setInitializationAttempted(true);
        return;
      }

      try {
        // Check if MetaMask is fully loaded
        if (typeof window.ethereum.isMetaMask === 'undefined') {
          console.log("Waiting for MetaMask to initialize...");
          
          // If we've tried too many times, stop retrying
          if (retryCount >= maxRetries) {
            console.log("Maximum retries reached. MetaMask may not be properly initialized.");
            setInitializationAttempted(true);
            return;
          }
          
          // Wait a moment and retry
          retryCount++;
          setTimeout(checkConnection, 1000);
          return;
        }
        
        console.log("Creating Web3 instance...");
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        // Try to get network ID with error handling
        try {
          console.log("Getting network ID...");
          const networkId = await safeGetNetworkId(web3Instance);
          
          if (networkId !== null) {
            console.log("Network ID:", networkId);
            setNetworkId(networkId);
          } else {
            console.warn("Could not determine network ID, using default");
            // Use a fallback for development
            if (import.meta.env.MODE === 'development') {
              setNetworkId(NETWORK_IDS.GANACHE);
            }
          }
        } catch (netError) {
          console.warn("Could not get network ID, may retry later:", netError);
          // Don't set error message here to avoid annoying users on page load
        }
        
        // Check if already connected
        try {
          console.log("Checking for existing accounts...");
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            console.log("Already connected to account:", accounts[0]);
            setAccount(accounts[0]);
          }
        } catch (accountError) {
          console.warn("Could not get accounts, may retry later:", accountError);
        }
        
        setInitializationAttempted(true);
      } catch (error) {
        console.error("Error checking existing connection:", error);
        
        // If we've tried too many times, stop retrying
        if (retryCount >= maxRetries) {
          console.log("Maximum retries reached. Giving up on blockchain initialization.");
          setInitializationAttempted(true);
          return;
        }
        
        // Wait a moment and retry
        retryCount++;
        setTimeout(checkConnection, 1000);
      }
    };
    
    checkConnection();
  }, [enableBlockchain, initializationAttempted]);

  // Listen for account and network changes
  useEffect(() => {
    if (window.ethereum && enableBlockchain) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          toast.info(`Account changed to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`);
        } else {
          disconnectWallet();
        }
      };
      
      const handleChainChanged = async () => {
        if (web3) {
          try {
            const newNetworkId = await safeGetNetworkId(web3);
            if (newNetworkId !== null) {
              setNetworkId(newNetworkId);
              toast.info(`Network changed to ${getNetworkName(newNetworkId)}`);
              
              // Re-initialize contracts when network changes
              setContractInitialized(false);
            }
          } catch (error) {
            console.error("Error getting network ID after chain change:", error);
          }
        }
      };
      
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [web3, enableBlockchain]);

  // Get network ID safely
  const safeGetNetworkId = async (web3Instance: Web3): Promise<number | null> => {
    // Try multiple methods to get network ID with timeouts
    try {
      // Set a timeout for the network ID request
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error("Network ID request timed out")), 5000)
      );
      
      // Try the primary method with timeout
      const networkIdPromise = web3Instance.eth.net.getId();
      const networkId = await Promise.race([networkIdPromise, timeoutPromise]);
      return networkId as number;
    } catch (error) {
      console.warn("Failed to get network ID with net.getId, trying eth.getChainId", error);
      
      try {
        // Try alternate method with timeout
        const timeoutPromise = new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error("Chain ID request timed out")), 5000)
        );
        
        const chainIdPromise = web3Instance.eth.getChainId();
        const chainId = await Promise.race([chainIdPromise, timeoutPromise]);
        return Number(chainId);
      } catch (chainError) {
        console.error("Failed to get chain ID as fallback:", chainError);
        
        try {
          // Last resort: try direct RPC request
          const provider = web3Instance.currentProvider;
          if (typeof provider !== 'string' && provider && 'request' in provider) {
            const response = await (provider as any).request({ 
              method: 'net_version', 
              params: [] 
            });
            return Number(response);
          }
        } catch (directError) {
          console.error("Direct RPC request also failed:", directError);
        }
        
        return null;
      }
    }
  };

  // Connect wallet
  const connectWallet = async (): Promise<string | false> => {
    setIsBlockchainLoading(true);
    setConnectionError(null);
    setConnectionAttempts(prev => prev + 1);
    
    try {
      if (!window.ethereum) {
        const error = "MetaMask not detected. Please install MetaMask.";
        setConnectionError(error);
        toast.error(error);
        throw new Error(error);
      }
      
      // Check if MetaMask is fully initialized
      if (typeof window.ethereum.isMetaMask === 'undefined') {
        const error = "MetaMask is not fully initialized. Please reload the page and try again.";
        setConnectionError(error);
        toast.error(error);
        throw new Error(error);
      }

      // Create a new Web3 instance with the current provider
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      
      // Request account access with timeout to prevent hanging
      let accounts;
      try {
        const requestAccountsPromise = window.ethereum.request({ method: "eth_requestAccounts" });
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timed out")), 15000)
        );
        
        accounts = await Promise.race([requestAccountsPromise, timeoutPromise]);
      } catch (requestError: any) {
        const errorMessage = requestError?.message || "Failed to request accounts";
        setConnectionError(errorMessage);
        throw new Error(errorMessage);
      }
      
      if (!accounts || accounts.length === 0) {
        const error = "No accounts found. Please unlock MetaMask.";
        setConnectionError(error);
        throw new Error(error);
      }
      
      // Try to get network ID safely
      const networkId = await safeGetNetworkId(web3Instance);
      if (networkId !== null) {
        setNetworkId(networkId);
      } else {
        // If both methods fail, use a fallback value for development
        console.warn("Failed to get network ID, using default fallback value");
        if (import.meta.env.MODE === 'development') {
          setNetworkId(NETWORK_IDS.GANACHE);
        }
      }
      
      // Set the connected account
      setAccount(accounts[0]);
      
      // Reset contract initialization flag to trigger re-initialization
      setContractInitialized(false);
      
      // Store the account in local storage for persistence
      try {
        localStorage.setItem('lastConnectedAccount', accounts[0]);
      } catch (storageError) {
        console.warn("Could not store account in local storage:", storageError);
      }
      
      toast.success("Wallet connected: " + accounts[0].substring(0, 6) + "..." + accounts[0].substring(accounts[0].length - 4));
      
      return accounts[0];
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Provide more helpful error messages for common issues
      let friendlyMessage = errorMessage;
      if (errorMessage.includes("JsonRpcEngine")) {
        friendlyMessage = "MetaMask connection issue. Please check that MetaMask is unlocked and try again. If the problem persists, try refreshing the page or restarting your browser.";
      }
      
      setConnectionError(friendlyMessage);
      toast.error("Failed to connect wallet: " + friendlyMessage);
      return false;
    } finally {
      setIsBlockchainLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWeb3(null);
    setAccount(null);
    setNetworkId(null);
    setKycContract(null);
    setTrustScoreContract(null);
    setLoanContract(null);
    setConnectionError(null);
    setContractInitialized(false);
    
    // Reset connection attempts
    setConnectionAttempts(0);
    
    // Clear stored account
    try {
      localStorage.removeItem('lastConnectedAccount');
    } catch (storageError) {
      console.warn("Could not remove account from local storage:", storageError);
    }
    
    toast.info("Wallet disconnected");
  }, []);

  // Switch network
  const switchNetwork = async (targetNetworkId: number): Promise<boolean> => {
    if (!window.ethereum) {
      const error = "MetaMask not detected";
      setConnectionError(error);
      toast.error(error);
      return false;
    }

    try {
      if (targetNetworkId === NETWORK_IDS.GANACHE || targetNetworkId === NETWORK_IDS.LOCALHOST) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: web3?.utils.toHex(targetNetworkId),
              chainName: 'Ganache Local',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['http://127.0.0.1:7545'],
              blockExplorerUrls: null,
            },
          ],
        });
      } else {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3?.utils.toHex(targetNetworkId) }],
        });
      }

      // Verify the network was switched by checking the ID again
      if (web3) {
        try {
          const newNetworkId = await safeGetNetworkId(web3);
          if (newNetworkId !== null) {
            setNetworkId(newNetworkId);
            // Reset contract initialization flag to trigger re-initialization
            setContractInitialized(false);
            toast.success(`Switched to ${getNetworkName(newNetworkId)}`);
          }
        } catch (netError) {
          console.warn("Could not verify network change:", netError);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Failed to switch network:", error);
      toast.error("Failed to switch network: " + (error as Error).message);
      return false;
    }
  };

  return {
    web3,
    account,
    networkId,
    networkName,
    isConnected,
    isCorrectNetwork,
    isGanache,
    isBlockchainLoading,
    connectionError,
    kycContract,
    trustScoreContract,
    loanContract,
    connectWallet,
    disconnectWallet,
    switchNetwork
  };
};
