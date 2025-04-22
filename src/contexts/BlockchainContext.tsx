
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMode } from "@/contexts/ModeContext";

interface BlockchainContextType {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isBlockchainLoading: boolean;
  networkName: string;
  isCorrectNetwork: boolean;
  isGanache: boolean;
  switchNetwork: (chainId: number) => Promise<void>;
  connectionError: string | null;
  blockNumber: number | null;
  submitKYC: (documentHash: string) => Promise<void>;
  isContractsInitialized: boolean;
}

export const BlockchainContext = createContext<BlockchainContextType>({
  account: null,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isBlockchainLoading: false,
  networkName: "",
  isCorrectNetwork: false,
  isGanache: false,
  switchNetwork: async () => {},
  connectionError: null,
  blockNumber: null,
  submitKYC: async () => {},
  isContractsInitialized: false,
});

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const { toast } = useToast();
  const { enableBlockchain } = useMode();
  
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(false);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState("");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isGanache, setIsGanache] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [isContractsInitialized, setIsContractsInitialized] = useState(false);

  // Initialize blockchain connection
  useEffect(() => {
    if (enableBlockchain) {
      checkIfWalletIsConnected();
      
      // Set up event listeners for account and network changes
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
    }
    
    return () => {
      // Clean up event listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [enableBlockchain]);

  // Initialize contracts when account and network are ready
  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      initializeContracts();
    } else {
      setIsContractsInitialized(false);
    }
  }, [isConnected, isCorrectNetwork]);

  // Check if wallet is already connected
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        setConnectionError("No Ethereum wallet found. Please install MetaMask.");
        return;
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Get current network
        await checkNetwork();
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
      setConnectionError("Error checking wallet connection.");
    }
  };
  
  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User has disconnected all accounts
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };
  
  // Handle network/chain changes
  const handleChainChanged = () => {
    // Refresh the page when the network changes
    window.location.reload();
  };

  // Check current network
  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkIdDecimal = parseInt(chainId, 16);
      setNetworkId(networkIdDecimal);
      
      // Set network name based on chainId
      let name = "";
      let correctNetwork = false;
      let ganache = false;
      
      switch (networkIdDecimal) {
        case 1:
          name = "Ethereum Mainnet";
          correctNetwork = true;
          break;
        case 5:
          name = "Goerli Testnet";
          correctNetwork = true;
          break;
        case 11155111:
          name = "Sepolia Testnet";
          correctNetwork = true;
          break;
        case 1337:
          name = "Ganache";
          correctNetwork = true;
          ganache = true;
          break;
        default:
          name = "Unknown Network";
          correctNetwork = false;
      }
      
      setNetworkName(name);
      setIsCorrectNetwork(correctNetwork);
      setIsGanache(ganache);
      
      // Get current block number
      const blockNumber = await window.ethereum.request({ 
        method: 'eth_blockNumber'
      });
      setBlockNumber(parseInt(blockNumber, 16));
      
    } catch (error) {
      console.error("Error checking network:", error);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      setIsBlockchainLoading(true);
      setConnectionError(null);
      
      if (!window.ethereum) {
        setConnectionError("No Ethereum wallet found. Please install MetaMask.");
        throw new Error("No Ethereum wallet found. Please install MetaMask.");
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts'
      });
      
      setAccount(accounts[0]);
      setIsConnected(true);
      
      // Check network after connecting
      await checkNetwork();
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
      });
      
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setConnectionError(error?.message || "Error connecting wallet.");
      
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error?.message || "Failed to connect wallet.",
      });
      
      throw error;
    } finally {
      setIsBlockchainLoading(false);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setConnectionError(null);
    setIsContractsInitialized(false);
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected.",
    });
  };
  
  // Switch network
  const switchNetwork = async (chainId: number) => {
    try {
      if (!window.ethereum) return;
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await addNetwork(chainId);
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      } else {
        console.error("Error switching network:", switchError);
      }
    }
  };
  
  // Add network to MetaMask
  const addNetwork = async (chainId: number) => {
    try {
      if (!window.ethereum) return;
      
      // Define network parameters based on chainId
      let params;
      switch (chainId) {
        case 1: // Ethereum Mainnet
          params = {
            chainId: '0x1',
            chainName: 'Ethereum Mainnet',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://mainnet.infura.io/v3/'],
            blockExplorerUrls: ['https://etherscan.io']
          };
          break;
        case 5: // Goerli Testnet
          params = {
            chainId: '0x5',
            chainName: 'Goerli Testnet',
            nativeCurrency: {
              name: 'Goerli Ether',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://goerli.infura.io/v3/'],
            blockExplorerUrls: ['https://goerli.etherscan.io']
          };
          break;
        case 1337: // Ganache
          params = {
            chainId: '0x539',
            chainName: 'Ganache',
            nativeCurrency: {
              name: 'Ganache Ether',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['http://localhost:7545'],
            blockExplorerUrls: []
          };
          break;
        default:
          throw new Error('Unsupported network');
      }
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
      
    } catch (error) {
      console.error("Error adding network:", error);
    }
  };

  // Initialize smart contracts
  const initializeContracts = async () => {
    try {
      // In a real implementation, you would initialize your contract instances here
      console.log("Initializing contracts...");
      
      // Simulate contract initialization
      setTimeout(() => {
        setIsContractsInitialized(true);
        console.log("Contracts initialized successfully");
        
        toast({
          title: "Contracts initialized",
          description: "Smart contracts are ready to use.",
        });
      }, 1500);
      
    } catch (error) {
      console.error("Error initializing contracts:", error);
      setIsContractsInitialized(false);
      
      toast({
        variant: "destructive",
        title: "Contract initialization failed",
        description: "Failed to initialize smart contracts. Please try again.",
      });
    }
  };
  
  // Submit KYC document hash to blockchain
  const submitKYC = async (documentHash: string) => {
    if (!isConnected || !isContractsInitialized) {
      throw new Error("Wallet not connected or contracts not initialized");
    }
    
    try {
      // In a real implementation, you would call your contract method here
      console.log(`Submitting KYC document hash: ${documentHash}`);
      
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "KYC document submitted",
        description: "Your document has been submitted to the blockchain.",
      });
      
      return;
    } catch (error) {
      console.error("Error submitting KYC:", error);
      throw error;
    }
  };

  const contextValue = {
    account,
    isConnected,
    connectWallet,
    disconnectWallet,
    isBlockchainLoading,
    networkName,
    isCorrectNetwork,
    isGanache,
    switchNetwork,
    connectionError,
    blockNumber,
    submitKYC,
    isContractsInitialized,
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => useContext(BlockchainContext);
