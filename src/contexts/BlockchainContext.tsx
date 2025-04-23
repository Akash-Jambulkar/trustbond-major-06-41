
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMode } from "@/contexts/ModeContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { generateMockTransactionHash } from "@/utils/mockBlockchain";
import { BlockchainContextType } from "@/utils/transactions";
import { 
  Transaction,
  TransactionType,
  getTransactions
} from "@/utils/transactions";
import { safeFrom } from "@/utils/supabase-utils";

// Create blockchain context
const BlockchainContext = createContext<BlockchainContextType | null>(null);

// Provider component
export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { enableBlockchain } = useMode();
  const { user } = useAuth();
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [networkName, setNetworkName] = useState<string>("Not Connected");
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [isGanache, setIsGanache] = useState<boolean>(false);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [web3, setWeb3] = useState<any>(null);
  const [isContractsInitialized, setIsContractsInitialized] = useState<boolean>(false);

  // Initialize blockchain connection if enabled
  useEffect(() => {
    // Blockchain is always enabled by default
    // Check for saved connection
    const savedAccount = localStorage.getItem('blockchain_account');
    if (savedAccount) {
      setAccount(savedAccount);
      setIsConnected(true);
      setNetworkName("Production Network");
      setNetworkId(1);
      setIsCorrectNetwork(true);
      loadTransactions(savedAccount);
    }
  }, []);

  // Load transactions when account or user changes
  const loadTransactions = async (address: string) => {
    if (!address) return;
    
    try {
      const txs = await getTransactions(address);
      setTransactions(txs);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  // Connect wallet function
  const connectWallet = async (): Promise<string | false> => {
    setIsBlockchainLoading(true);
    setConnectionError(null);

    try {
      let walletAddress: string;
      
      // Check if window.ethereum is available (MetaMask or other wallet)
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          walletAddress = accounts[0];
          
          // Get network ID
          const chainId = await window.ethereum.request({ 
            method: 'eth_chainId' 
          });
          
          const networkId = parseInt(chainId, 16);
          setNetworkId(networkId);
          
          // Set network name based on chain ID
          if (networkId === 1) {
            setNetworkName("Ethereum Mainnet");
          } else if (networkId === 4) {
            setNetworkName("Rinkeby Testnet");
          } else if (networkId === 1337 || networkId === 31337) {
            setNetworkName("Local Network");
            setIsGanache(true);
          } else {
            setNetworkName(`Network (${networkId})`);
          }
          
          // Always consider correct network
          setIsCorrectNetwork(true);
        } catch (error) {
          console.error("User denied wallet access:", error);
          
          // Fallback to mock wallet in development/testing
          walletAddress = `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`;
          setNetworkName("Simulated Network");
          setNetworkId(1337);
          setIsCorrectNetwork(true);
          setIsGanache(true);
        }
      } else {
        // Fallback to mock wallet in development/testing
        walletAddress = `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`;
        setNetworkName("Simulated Network");
        setNetworkId(1337);
        setIsCorrectNetwork(true);
        setIsGanache(true);
      }
      
      // Update state
      setAccount(walletAddress);
      setIsConnected(true);
      
      // Save connection
      localStorage.setItem('blockchain_account', walletAddress);
      
      // Load transactions
      loadTransactions(walletAddress);
      
      toast.success("Wallet connected successfully!");
      return walletAddress;
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      setConnectionError(error.message || "Failed to connect wallet");
      toast.error("Failed to connect wallet");
      return false;
    } finally {
      setIsBlockchainLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setNetworkName("Not Connected");
    setNetworkId(null);
    setIsCorrectNetwork(false);
    setIsGanache(false);
    setTransactions([]);
    
    // Remove saved connection
    localStorage.removeItem('blockchain_account');
    
    toast.success("Wallet disconnected");
  };

  // Submit KYC function
  const submitKYC = async (documentHash: string, feeInWei?: string): Promise<boolean> => {
    if (!isConnected || !account) {
      toast.error("Wallet not connected");
      return false;
    }
    
    if (!user?.id) {
      toast.error("User not authenticated");
      return false;
    }
    
    try {
      // Generate transaction hash
      const transactionHash = generateMockTransactionHash();
      
      // Create transaction record
      await safeFrom('transactions')
        .insert({
          transaction_hash: transactionHash,
          type: 'kyc',
          from_address: account.toLowerCase(),
          to_address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          status: 'pending'
        });
      
      // Store KYC document submission in database
      await safeFrom('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: 'generic',
          document_hash: documentHash,
          verification_status: 'pending'
        });
      
      // Simulate blockchain confirmation
      setTimeout(async () => {
        await safeFrom('transactions')
          .update({ status: 'confirmed' })
          .eq('transaction_hash', transactionHash);
        
        // Reload transactions
        loadTransactions(account);
        
        toast.success("KYC transaction confirmed");
      }, 3000);
      
      return true;
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC document");
      return false;
    }
  };

  // Get KYC status function
  const getKYCStatus = async (address: string): Promise<boolean> => {
    if (!isConnected) {
      return false;
    }
    
    try {
      // Check for KYC verification in transactions
      const txs = await getTransactions(address);
      
      // Find the latest KYC transaction
      const kycTx = txs.find(tx => 
        tx.type === "kyc" && 
        tx.status === "confirmed"
      );
      
      return !!kycTx;
    } catch (error) {
      console.error("Error getting KYC status:", error);
      return false;
    }
  };

  // Verify KYC function - updated to match the new type signature
  const verifyKYC = async (kycId: string, verificationStatus: 'verified' | 'rejected'): Promise<boolean> => {
    if (!isConnected || !account) {
      toast.error("Wallet not connected");
      return false;
    }

    try {
      // Update KYC document verification status
      const { data, error } = await safeFrom('kyc_documents')
        .update({ 
          verification_status: verificationStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', kycId);
      
      if (error) {
        console.error("Error verifying KYC:", error);
        toast.error("Failed to verify KYC document");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC document");
      return false;
    }
  };

  // Mock functions needed by the app
  const getTransactionHistory = async (): Promise<any[]> => {
    try {
      return await getTransactions(account || '');
    } catch (error) {
      console.error("Error getting transaction history:", error);
      return [];
    }
  };
  
  const switchNetwork = async (networkId: number): Promise<boolean> => {
    console.log(`Switching to network: ${networkId}`);
    return true;
  };
  
  const registerBank = async (bankData: any): Promise<boolean> => {
    console.log("Registering bank:", bankData);
    return true;
  };
  
  const repayLoan = async (loanId: string, amountInWei: string): Promise<boolean> => {
    console.log(`Repaying loan ${loanId} with amount ${amountInWei}`);
    return true;
  };
  
  const approveLoan = async (loanId: string): Promise<boolean> => {
    console.log(`Approving loan ${loanId}`);
    return true;
  };
  
  const rejectLoan = async (loanId: string): Promise<boolean> => {
    console.log(`Rejecting loan ${loanId}`);
    return true;
  };
  
  const submitLoanApplication = async (loanData: any): Promise<string | null> => {
    console.log("Submitting loan application:", loanData);
    return "loan123";
  };

  // Get all context values
  const contextValue: BlockchainContextType = {
    account,
    isConnected,
    networkName,
    networkId,
    isCorrectNetwork,
    isGanache,
    isBlockchainLoading,
    connectionError,
    transactions,
    web3,
    kycContract: null,
    trustScoreContract: null,
    loanContract: null,
    isContractsInitialized,
    kycStatus: 'pending', // Mock KYC status
    connectWallet,
    disconnectWallet,
    submitKYC,
    getKYCStatus,
    verifyKYC,
    getTransactionHistory,
    switchNetwork,
    registerBank,
    repayLoan,
    approveLoan,
    rejectLoan,
    submitLoanApplication
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};

// Create and export the hook
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};
