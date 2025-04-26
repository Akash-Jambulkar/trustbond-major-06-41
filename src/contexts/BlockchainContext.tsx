
import { createContext, ReactNode, useContext, useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { useAuth } from "./AuthContext";
import { useMode } from "./ModeContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

type NetworkType = {
  id: number;
  name: string;
};

interface Transaction {
  transactionHash: string;
  blockNumber: number;
  status: boolean;
}

interface BlockchainContextType {
  web3: Web3 | null;
  account: string | null;
  networkId: number | null;
  networkName: string;
  isConnected: boolean;
  isContractsInitialized: boolean;
  isGanache: boolean;
  isBlockchainLoading: boolean;
  isCorrectNetwork: boolean;
  connectionError: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (networkId: number) => Promise<void>;
  submitKYC: (documentHash: string, fee: string) => Promise<Transaction | null>;
  verifyKYC: (documentHash: string) => Promise<Transaction | null>;
  getTrustScore: (address: string) => Promise<number>;
  updateTrustScore: (address: string, score: number) => Promise<Transaction | null>;
  applyForLoan: (amount: number, duration: number) => Promise<Transaction | null>;
  approveLoan: (loanId: number) => Promise<Transaction | null>;
  rejectLoan: (loanId: number) => Promise<Transaction | null>;
  repayLoan: (loanId: number, amount: number) => Promise<Transaction | null>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

const networks: Record<number, string> = {
  1: "Ethereum Mainnet",
  3: "Ropsten Testnet",
  4: "Rinkeby Testnet",
  5: "Goerli Testnet",
  42: "Kovan Testnet",
  1337: "Ganache (Local)"
};

const targetNetworks = [1337, 1, 5]; // Ganache, Mainnet, Goerli

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { enableBlockchain } = useMode();
  
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isContractsInitialized, setIsContractsInitialized] = useState(false);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Initialize Web3 when component mounts if blockchain is enabled
  useEffect(() => {
    if (enableBlockchain) {
      initWeb3();
    } else {
      setIsConnected(false);
      setWeb3(null);
      setAccount(null);
    }
  }, [enableBlockchain]);

  // Initialize Web3 and set up event listeners
  const initWeb3 = async () => {
    if (!enableBlockchain) return;

    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          console.log('Chain changed to:', parseInt(chainId, 16));
          setNetworkId(parseInt(chainId, 16));
          window.location.reload();
        });
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          console.log('Account changed to:', accounts[0]);
          setAccount(accounts[0] || null);
          if (!accounts[0]) {
            setIsConnected(false);
          }
        });
        
        // Get the current network ID
        const chainId = await web3Instance.eth.getChainId();
        setNetworkId(chainId);
        
        // Check if any accounts are already connected
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }

        // Initialize smart contracts
        initializeContracts();

        setConnectionError(null);
      } else {
        setConnectionError("MetaMask is not installed. Please install MetaMask to use blockchain features.");
      }
    } catch (error: any) {
      console.error("Error initializing Web3:", error);
      setConnectionError(error.message || "An error occurred while initializing blockchain connection");
    }
  };

  // Check if the current network is one we support
  const isCorrectNetwork = targetNetworks.includes(networkId || 0);
  
  // Check if we're using Ganache (local blockchain)
  const isGanache = networkId === 1337;

  // Get a readable network name
  const networkName = networkId ? (networks[networkId] || `Unknown Network (ID: ${networkId})`) : "Not Connected";

  // Connect wallet function
  const connectWallet = async () => {
    if (!enableBlockchain) {
      toast.error("Blockchain features are disabled", {
        description: "Enable blockchain features in settings first."
      });
      return;
    }

    setIsBlockchainLoading(true);
    setConnectionError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install MetaMask to use blockchain features.");
      }

      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Request accounts from MetaMask
      await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      const accounts = await web3Instance.eth.getAccounts();
      
      if (accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask and try again.");
      }

      setAccount(accounts[0]);
      setIsConnected(true);

      // Get the current network ID
      const chainId = await web3Instance.eth.getChainId();
      setNetworkId(chainId);

      // Initialize smart contracts
      await initializeContracts();

      // Save wallet address to user profile
      if (user) {
        await supabase
          .from('profiles')
          .update({ wallet_address: accounts[0] })
          .eq('id', user.id);
      }
      
      toast.success("Wallet Connected", {
        description: `Connected to account ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`
      });
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      setConnectionError(error.message || "Failed to connect to MetaMask");
      toast.error("Connection Error", {
        description: error.message || "Failed to connect to MetaMask"
      });
    } finally {
      setIsBlockchainLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    toast.info("Wallet Disconnected");
  };

  // Switch network function
  const switchNetwork = async (targetNetworkId: number) => {
    if (!web3 || !window.ethereum) return;
    
    try {
      let hexChainId = '0x' + targetNetworkId.toString(16);
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
      
      // Network is switched by the event listener
      
    } catch (error: any) {
      console.error("Error switching network:", error);
      
      // If the chain is not added to MetaMask
      if (error.code === 4902) {
        toast.error("Network not available", {
          description: "This network is not available in your wallet."
        });
      } else {
        toast.error("Network Switch Failed", {
          description: error.message
        });
      }
    }
  };

  // Initialize smart contracts
  const initializeContracts = async () => {
    if (!web3) return;
    
    try {
      // In a real app, we would load the contract ABIs and addresses here
      // For this demo, we'll just simulate contract initialization
      setIsContractsInitialized(true);
    } catch (error) {
      console.error("Error initializing contracts:", error);
      setIsContractsInitialized(false);
    }
  };

  // Submit KYC function
  const submitKYC = async (documentHash: string, fee: string): Promise<Transaction | null> => {
    if (!web3 || !account || !isConnected) {
      toast.error("Wallet not connected", {
        description: "Connect your wallet to submit KYC documents."
      });
      return null;
    }

    try {
      // For the MVP, we'll simulate a blockchain transaction
      console.log(`Submitting KYC document hash: ${documentHash} with fee: ${fee}`);
      
      // In a real implementation, this would call a smart contract method
      // For now, we're simulating the transaction
      
      // Record the transaction in the database first
      const txHash = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const { error } = await supabase
        .from('transactions')
        .insert({
          transaction_hash: txHash,
          transaction_type: 'kyc_submission',
          user_id: user?.id,
          from_address: account,
          amount: Web3.utils.fromWei(fee, 'ether'),
          gas_used: 21000,
          gas_price: Web3.utils.toWei('10', 'gwei'),
          status: 'completed',
          blockchain_timestamp: new Date().toISOString()
        });

      if (error) {
        console.error("Error creating transaction record:", error);
        throw error;
      }

      // Now update the KYC submission with the transaction hash
      const { error: updateError } = await supabase
        .from('kyc_document_submissions')
        .update({ blockchain_tx_hash: txHash })
        .eq('document_hash', documentHash);

      if (updateError) {
        console.error("Error updating KYC submission:", updateError);
      }

      const simulatedTransaction: Transaction = {
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000),
        status: true
      };

      return simulatedTransaction;
      
    } catch (error: any) {
      console.error("Error submitting KYC:", error);
      toast.error("KYC Submission Failed", {
        description: error.message || "An error occurred while submitting your KYC document."
      });
      return null;
    }
  };

  // Verify KYC function
  const verifyKYC = async (documentHash: string): Promise<Transaction | null> => {
    if (!web3 || !account || !isConnected) {
      toast.error("Wallet not connected", {
        description: "Connect your wallet to verify KYC documents."
      });
      return null;
    }

    try {
      console.log(`Verifying KYC document hash: ${documentHash}`);
      
      // In a real implementation, this would call a smart contract method
      // For now, we're simulating the transaction
      
      const txHash = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const simulatedTransaction: Transaction = {
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000),
        status: true
      };

      return simulatedTransaction;
      
    } catch (error: any) {
      console.error("Error verifying KYC:", error);
      toast.error("KYC Verification Failed", {
        description: error.message || "An error occurred while verifying the KYC document."
      });
      return null;
    }
  };

  // Get Trust Score function
  const getTrustScore = async (address: string): Promise<number> => {
    if (!web3 || !isConnected) return 0;
    
    try {
      // In a real implementation, this would call a smart contract method
      // For now, we'll return a random score between 300 and 850
      return Math.floor(Math.random() * 550) + 300;
    } catch (error) {
      console.error("Error getting trust score:", error);
      return 0;
    }
  };

  // Update Trust Score function
  const updateTrustScore = async (address: string, score: number): Promise<Transaction | null> => {
    if (!web3 || !account || !isConnected) return null;
    
    try {
      // In a real implementation, this would call a smart contract method
      
      const txHash = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const simulatedTransaction: Transaction = {
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000),
        status: true
      };

      return simulatedTransaction;
    } catch (error) {
      console.error("Error updating trust score:", error);
      return null;
    }
  };

  // Apply for loan function
  const applyForLoan = async (amount: number, duration: number): Promise<Transaction | null> => {
    if (!web3 || !account || !isConnected) return null;
    
    try {
      // In a real implementation, this would call a smart contract method
      
      const txHash = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const simulatedTransaction: Transaction = {
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000),
        status: true
      };

      return simulatedTransaction;
    } catch (error) {
      console.error("Error applying for loan:", error);
      return null;
    }
  };

  // Approve loan function
  const approveLoan = async (loanId: number): Promise<Transaction | null> => {
    if (!web3 || !account || !isConnected) return null;
    
    try {
      // In a real implementation, this would call a smart contract method
      
      const txHash = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const simulatedTransaction: Transaction = {
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000),
        status: true
      };

      return simulatedTransaction;
    } catch (error) {
      console.error("Error approving loan:", error);
      return null;
    }
  };

  // Reject loan function
  const rejectLoan = async (loanId: number): Promise<Transaction | null> => {
    if (!web3 || !account || !isConnected) return null;
    
    try {
      // In a real implementation, this would call a smart contract method
      
      const txHash = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const simulatedTransaction: Transaction = {
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000),
        status: true
      };

      return simulatedTransaction;
    } catch (error) {
      console.error("Error rejecting loan:", error);
      return null;
    }
  };

  // Repay loan function
  const repayLoan = async (loanId: number, amount: number): Promise<Transaction | null> => {
    if (!web3 || !account || !isConnected) return null;
    
    try {
      // In a real implementation, this would call a smart contract method
      
      const txHash = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const simulatedTransaction: Transaction = {
        transactionHash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000),
        status: true
      };

      return simulatedTransaction;
    } catch (error) {
      console.error("Error repaying loan:", error);
      return null;
    }
  };

  return (
    <BlockchainContext.Provider value={{
      web3,
      account,
      networkId,
      networkName,
      isConnected,
      isContractsInitialized,
      isGanache,
      isBlockchainLoading,
      isCorrectNetwork,
      connectionError,
      connectWallet,
      disconnectWallet,
      switchNetwork,
      submitKYC,
      verifyKYC,
      getTrustScore,
      updateTrustScore,
      applyForLoan,
      approveLoan,
      rejectLoan,
      repayLoan
    }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = (): BlockchainContextType => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};
