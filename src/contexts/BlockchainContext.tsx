
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { BlockchainContextType } from "@/contexts/blockchain/types/contextTypes";
import { useMode } from "@/contexts/ModeContext";

// Mock blockchain functionality - in a real app this would connect to an actual blockchain
const BlockchainContext = createContext<BlockchainContextType | null>(null);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { enableBlockchain } = useMode();
  const { user } = useAuth();
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string>("Not Connected");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [isGanache, setIsGanache] = useState<boolean>(false);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [kycStatus, setKycStatus] = useState<'not_verified' | 'pending' | 'verified' | 'rejected'>('not_verified');
  const [kycContract, setKycContract] = useState<any>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<any>(null);
  const [loanContract, setLoanContract] = useState<any>(null);
  const [isOptimized, setIsOptimized] = useState<boolean>(true);
  const [isContractsInitialized, setIsContractsInitialized] = useState<boolean>(false);
  const [web3, setWeb3] = useState<any>(null);
  
  useEffect(() => {
    if (enableBlockchain) {
      // Mock connection for development
      const mockConnection = async () => {
        setIsBlockchainLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockAccount = `0x${Math.random().toString(16).substring(2, 42)}`;
        setAccount(mockAccount);
        setNetworkId(1337);
        setNetworkName("Development Network");
        setIsConnected(true);
        setIsCorrectNetwork(true);
        setIsGanache(true);
        setIsContractsInitialized(true);
        setKycContract({});
        setTrustScoreContract({});
        setLoanContract({});
        setWeb3({});
        setIsBlockchainLoading(false);
      };
      
      mockConnection();
    } else {
      setIsConnected(false);
      setAccount(null);
      setKycContract(null);
      setTrustScoreContract(null);
      setLoanContract(null);
    }
  }, [enableBlockchain]);
  
  useEffect(() => {
    const checkKycStatus = async () => {
      if (user && isConnected) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('kyc_status')
            .eq('id', user.id)
            .single();
          
          if (!error && data?.kyc_status) {
            setKycStatus(data.kyc_status as any);
          }
        } catch (error) {
          console.error("Error checking KYC status:", error);
        }
      }
    };
    
    checkKycStatus();
  }, [user, isConnected]);

  // Connect wallet function
  const connectWallet = async () => {
    if (!enableBlockchain) {
      toast.error("Blockchain features are disabled");
      return false;
    }
    
    setIsBlockchainLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockAccount = `0x${Math.random().toString(16).substring(2, 42)}`;
      setAccount(mockAccount);
      setNetworkId(1337);
      setNetworkName("Development Network");
      setIsConnected(true);
      setIsCorrectNetwork(true);
      setIsGanache(true);
      toast.success("Wallet connected successfully!");
      setIsBlockchainLoading(false);
      return mockAccount;
    } catch (error) {
      console.error("Wallet connection error:", error);
      setConnectionError("Failed to connect wallet");
      setIsBlockchainLoading(false);
      toast.error("Failed to connect wallet");
      return false;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    toast.success("Wallet disconnected");
  };

  const switchNetwork = async (chainId: number) => {
    setNetworkId(chainId);
    setNetworkName(chainId === 1 ? "Ethereum Mainnet" : 
                  chainId === 5 ? "Goerli Testnet" : 
                  chainId === 1337 ? "Development Network" : 
                  "Unknown Network");
    setIsGanache(chainId === 1337);
    toast.success(`Switched to ${chainId === 1337 ? "Development Network" : 
                chainId === 1 ? "Ethereum Mainnet" : 
                chainId === 5 ? "Goerli Testnet" : 
                "Unknown Network"}`);
    return true;
  };

  const submitKYC = async (documentHash: string, feeInWei?: string) => {
    if (!isConnected || !user) {
      toast.error("Wallet not connected or user not logged in");
      return false;
    }
    
    try {
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      // Store transaction record
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          transaction_hash: txHash,
          type: 'kyc_submission',
          user_id: user.id,
          from_address: account,
          status: 'completed'
        });
        
      if (txError) {
        console.error("Error storing transaction:", txError);
        throw txError;
      }
      
      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ kyc_status: 'pending' })
        .eq('id', user.id);
        
      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }
      
      setKycStatus('pending');
      toast.success("KYC document submitted successfully");
      return true;
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC document");
      return false;
    }
  };

  const verifyKYC = async (kycId: string, verificationStatus: 'verified' | 'rejected') => {
    if (!isConnected || !user || user.role !== 'bank') {
      toast.error("Not authorized or wallet not connected");
      return false;
    }
    
    try {
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      // Get KYC document details to get user ID
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_document_submissions')
        .select('user_id')
        .eq('id', kycId)
        .single();
        
      if (kycError || !kycData) {
        console.error("Error fetching KYC document:", kycError);
        throw kycError || new Error("KYC document not found");
      }
      
      // Store transaction record
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          transaction_hash: txHash,
          type: 'kyc_verification',
          user_id: kycData.user_id,
          from_address: account,
          status: 'completed'
        });
        
      if (txError) {
        console.error("Error storing transaction:", txError);
        throw txError;
      }
      
      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ kyc_status: verificationStatus })
        .eq('id', kycData.user_id);
        
      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }
      
      toast.success(`KYC document ${verificationStatus} successfully`);
      return true;
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC document");
      return false;
    }
  };

  const getKYCStatus = async (address: string) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('kyc_status')
        .eq('wallet_address', address)
        .single();
        
      if (error || !data) {
        return false;
      }
      
      return data.kyc_status === 'verified';
    } catch (error) {
      console.error("Error checking KYC status:", error);
      return false;
    }
  };

  const getTransactionHistory = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setTransactions(data || []);
      return data || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  // Mock functions for loan operations
  const submitLoanApplication = async (loanData: any) => {
    toast.success("Loan application submitted successfully");
    return "mock-loan-id";
  };
  
  const approveLoan = async (loanId: string) => {
    toast.success("Loan approved successfully");
    return true;
  };
  
  const rejectLoan = async (loanId: string) => {
    toast.success("Loan application rejected");
    return true;
  };
  
  const repayLoan = async (loanId: string, amountInWei: string) => {
    toast.success(`Loan repayment of ${amountInWei} processed`);
    return true;
  };
  
  const registerBank = async (bankData: any) => {
    toast.success("Bank registered successfully");
    return true;
  };

  // Additional functions for trust score
  const updateTrustScore = async (address: string, score: number) => {
    toast.success(`Trust score updated to ${score}`);
    return true;
  };
  
  const getTrustScore = async (address: string) => {
    return Math.floor(Math.random() * 100);
  };
  
  const getUserLoans = async () => {
    return [];
  };
  
  const clearBlockchainCache = () => {
    // Mock function
  };

  const value: BlockchainContextType = {
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
    kycStatus,
    transactions,
    isContractsInitialized,
    isOptimized,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    submitKYC,
    verifyKYC,
    getKYCStatus,
    getTransactionHistory,
    submitLoanApplication,
    approveLoan,
    rejectLoan,
    repayLoan,
    registerBank,
    updateTrustScore,
    getTrustScore,
    getUserLoans,
    clearBlockchainCache
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};
