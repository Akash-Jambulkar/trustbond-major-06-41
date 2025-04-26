import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMode } from "@/contexts/ModeContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { generateMockTransactionHash } from "@/utils/mockBlockchain";
import { BlockchainContextType } from "@/contexts/blockchain/types";

// Create blockchain context
const BlockchainContext = createContext<BlockchainContextType | null>(null);

// In a real implementation, this would interface with actual blockchain
// For now, we'll simulate blockchain interactions with Supabase
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
  const [kycStatus, setKycStatus] = useState<'not_verified' | 'pending' | 'verified' | 'rejected'>('not_verified');
  const [web3, setWeb3] = useState<any>(null);
  const [kycContract, setKycContract] = useState<any>(null);
  const [trustScoreContract, setTrustScoreContract] = useState<any>(null);
  const [loanContract, setLoanContract] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isContractsInitialized, setIsContractsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (enableBlockchain) {
      const savedAccount = localStorage.getItem('blockchain_account');
      if (savedAccount) {
        setAccount(savedAccount);
        setIsConnected(true);
        setNetworkName("Development Network");
        setIsCorrectNetwork(true);
        setIsGanache(true);
      }
      
      // Check if MetaMask is installed and try to connect
      if (window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts && accounts.length > 0) {
              setAccount(accounts[0]);
              setIsConnected(true);
              setNetworkName("MetaMask Network");
              setIsCorrectNetwork(true);
              
              // Get network ID
              window.ethereum.request({ method: 'net_version' })
                .then((networkId: string) => {
                  const id = parseInt(networkId);
                  setNetworkId(id);
                  
                  if (id === 1337 || id === 5777) {
                    setIsGanache(true);
                    setNetworkName("Ganache");
                  } else if (id === 1) {
                    setNetworkName("Ethereum Mainnet");
                  } else if (id === 5) {
                    setNetworkName("Goerli Testnet");
                  } else {
                    setNetworkName(`Network ID: ${id}`);
                  }
                })
                .catch(console.error);
            }
          })
          .catch(console.error);
      }
    } else {
      setAccount(null);
      setIsConnected(false);
      setNetworkName("Not Connected");
      setIsCorrectNetwork(false);
      setIsGanache(false);
    }
  }, [enableBlockchain]);

  useEffect(() => {
    const checkKycStatus = async () => {
      try {
        if (isConnected && account && user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('kyc_status')
            .eq('user_id', user.user_id)
            .single();
          
          if (error) {
            console.log("Error checking KYC status:", error);
            return;
          }
          
          if (data && data.kyc_status) {
            setKycStatus(data.kyc_status as any);
          }
        } else {
          setKycStatus('not_verified');
        }
      } catch (error) {
        console.error("Error checking KYC status:", error);
      }
    };
    
    checkKycStatus();
  }, [isConnected, account, user]);

  const connectWallet = async (): Promise<string | false> => {
    if (!enableBlockchain) {
      toast.error("Blockchain features are disabled");
      return false;
    }

    setIsBlockchainLoading(true);
    setConnectionError(null);

    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          if (accounts.length > 0) {
            const account = accounts[0];
            setAccount(account);
            setIsConnected(true);
            
            // Get network ID
            const networkId = await window.ethereum.request({ method: 'net_version' });
            const id = parseInt(networkId);
            setNetworkId(id);
            
            if (id === 1337 || id === 5777) {
              setIsGanache(true);
              setNetworkName("Ganache");
              setIsCorrectNetwork(true);
            } else if (id === 1) {
              setNetworkName("Ethereum Mainnet");
              setIsCorrectNetwork(true);
            } else if (id === 5) {
              setNetworkName("Goerli Testnet");
              setIsCorrectNetwork(true);
            } else {
              setNetworkName(`Network ID: ${id}`);
              setIsCorrectNetwork(false);
            }
            
            localStorage.setItem('blockchain_account', account);
            toast.success("Wallet connected successfully!");
            return account;
          } else {
            throw new Error("No accounts found");
          }
        } catch (error: any) {
          console.error("MetaMask connection error:", error);
          const errorMessage = error?.message || "Unknown MetaMask error";
          setConnectionError(errorMessage);
          toast.error(`Failed to connect MetaMask: ${errorMessage}`);
          return false;
        }
      } else {
        // Fall back to mock account if MetaMask is not installed
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockAccount = `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`;
        setAccount(mockAccount);
        setIsConnected(true);
        setNetworkName("Development Network");
        setIsCorrectNetwork(true);
        setIsGanache(true);
        
        localStorage.setItem('blockchain_account', mockAccount);
        
        toast.success("Mock wallet connected successfully!");
        return mockAccount;
      }
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      const errorMessage = error?.message || "Unknown error";
      setConnectionError(errorMessage);
      toast.error(`Failed to connect wallet: ${errorMessage}`);
      return false;
    } finally {
      setIsBlockchainLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setNetworkName("Not Connected");
    setIsCorrectNetwork(false);
    setIsGanache(false);
    
    localStorage.removeItem('blockchain_account');
    
    toast.success("Wallet disconnected");
  };

  const switchNetwork = async (chainId: number): Promise<boolean> => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (chainId === 1337) {
        setNetworkName("Development Network");
        setIsCorrectNetwork(true);
        setIsGanache(true);
      } else if (chainId === 1) {
        setNetworkName("Ethereum Mainnet");
        setIsCorrectNetwork(false);
        setIsGanache(false);
      } else if (chainId === 5) {
        setNetworkName("Goerli Testnet");
        setIsCorrectNetwork(false);
        setIsGanache(false);
      } else {
        setNetworkName("Unknown Network");
        setIsCorrectNetwork(false);
        setIsGanache(false);
      }
      
      toast.success(`Switched to ${networkName}`);
      return true;
    } catch (error) {
      console.error("Network switch error:", error);
      toast.error("Failed to switch network");
      return false;
    }
  };

  const submitKYC = async (documentHash: string, feeInWei?: string): Promise<boolean> => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }

    if (!user) {
      toast.error("User not authenticated");
      return false;
    }

    try {
      const transactionHash = generateMockTransactionHash();
      
      // Store KYC document
      const { error: kycError } = await supabase
        .from('kyc_documents')
        .insert([
          {
            user_id: user.user_id,
            document_type: 'identity',
            document_hash: documentHash,
            verification_status: 'pending'
          }
        ]);

      if (kycError) {
        console.error("KYC document storage error:", kycError);
        toast.error("Failed to store KYC document");
        return false;
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ kyc_status: 'pending' })
        .eq('user_id', user.user_id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast.error("Failed to update KYC status");
        return false;
      }

      // Record transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert([
          {
            transaction_hash: transactionHash,
            type: 'kyc',
            from_address: account,
            status: 'confirmed',
            user_id: user.user_id
          }
        ]);
        
      if (txError) {
        console.error("Transaction record error:", txError);
        toast.error("Failed to record KYC transaction");
        return false;
      }

      setKycStatus('pending');
      toast.success("KYC document submitted successfully!");
      return true;
    } catch (error) {
      console.error("KYC submission error:", error);
      toast.error("Failed to submit KYC document");
      return false;
    }
  };

  const verifyKYC = async (kycId: string, verificationStatus: 'verified' | 'rejected'): Promise<boolean> => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }

    if (!user || user.role !== 'bank') {
      toast.error("Unauthorized operation");
      return false;
    }

    try {
      const transactionHash = generateMockTransactionHash();
      
      // Get KYC document user
      const { data: kycData, error: kycFetchError } = await supabase
        .from('kyc_documents')
        .select('user_id')
        .eq('id', kycId)
        .single();

      if (kycFetchError || !kycData) {
        console.error("KYC fetch error:", kycFetchError);
        toast.error("Failed to fetch KYC document");
        return false;
      }

      // Update KYC document status
      const { error: kycUpdateError } = await supabase
        .from('kyc_documents')
        .update({
          verification_status: verificationStatus,
          verified_by: user.user_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', kycId);

      if (kycUpdateError) {
        console.error("KYC update error:", kycUpdateError);
        toast.error("Failed to update KYC status");
        return false;
      }

      // Update user profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ kyc_status: verificationStatus })
        .eq('user_id', kycData.user_id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast.error("Failed to update user KYC status");
        return false;
      }

      // Record transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert([
          {
            transaction_hash: transactionHash,
            type: 'verification',
            from_address: account,
            to_address: kycData.user_id,
            amount: 0,
            status: 'confirmed',
            user_id: kycData.user_id,
            bank_id: user.user_id
          }
        ]);
        
      if (txError) {
        console.error("Transaction record error:", txError);
        toast.error("Failed to record verification transaction");
        return false;
      }

      toast.success(`KYC document ${verificationStatus}`);
      return true;
    } catch (error) {
      console.error("KYC verification error:", error);
      toast.error("Failed to verify KYC document");
      return false;
    }
  };

  const getTransactionHistory = async (): Promise<any[]> => {
    if (!user) {
      return [];
    }

    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (user.role === 'user') {
        query = query.eq('user_id', user.user_id);
      } else if (user.role === 'bank') {
        query = query.eq('bank_id', user.user_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Transaction history error:", error);
        throw error;
      }

      // Update transactions state
      setTransactions(data || []);
      return data || [];
    } catch (error) {
      console.error("Transaction history error:", error);
      return [];
    }
  };

  const getKYCStatus = async (address: string): Promise<boolean> => {
    if (!enableBlockchain || !isConnected) {
      return false;
    }

    try {
      // In a production environment, we would check the blockchain
      // For now, we simulate by checking Supabase
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('kyc_status')
          .eq('user_id', user.user_id)
          .single();

        if (error) {
          console.error("KYC status check error:", error);
          return false;
        }
        
        return data?.kyc_status === 'verified';
      }
      return false;
    } catch (error) {
      console.error("KYC status check error:", error);
      return false;
    }
  };

  const submitLoanApplication = async (loanData: any): Promise<string | null> => {
    if (!enableBlockchain || !isConnected || !user) {
      toast.error("Wallet not connected or user not authenticated");
      return null;
    }
    toast.success("Loan application submitted successfully!");
    return "mock-loan-id";
  };

  const approveLoan = async (loanId: string): Promise<boolean> => {
    if (!enableBlockchain || !isConnected || !user || user.role !== 'bank') {
      toast.error("Unauthorized operation");
      return false;
    }
    toast.success("Loan approved successfully!");
    return true;
  };

  const rejectLoan = async (loanId: string, reason?: string): Promise<boolean> => {
    if (!enableBlockchain || !isConnected || !user || user.role !== 'bank') {
      toast.error("Unauthorized operation");
      return false;
    }
    toast.success("Loan rejected");
    return true;
  };

  const repayLoan = async (loanId: string, amountInWei: string): Promise<boolean> => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }
    toast.success(`Simulated loan repayment of ${amountInWei} ETH`);
    return true;
  };

  const registerBank = async (bankData: any): Promise<boolean> => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }
    toast.success("Bank registration submitted");
    return true;
  };

  const getUserLoans = async (): Promise<any[]> => {
    if (!enableBlockchain || !isConnected || !user) {
      return [];
    }
    
    try {
      // In a real implementation, this would fetch loans from the blockchain
      // For now, we'll fetch from Supabase
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching user loans:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error fetching user loans:", error);
      return [];
    }
  };

  const updateTrustScore = async (address: string, score: number): Promise<boolean> => {
    if (!enableBlockchain || !isConnected || !user?.role === 'bank') {
      toast.error("Unauthorized operation");
      return false;
    }
    
    toast.success("Trust score updated");
    return true;
  };

  const getTrustScore = async (address: string): Promise<number> => {
    // Return a random score between 50-90 for demonstration
    return Math.floor(Math.random() * 40) + 50;
  };

  const clearBlockchainCache = () => {
    localStorage.removeItem('blockchain_account');
    localStorage.removeItem('blockchain_tx_history');
    setAccount(null);
    setIsConnected(false);
    setTransactions([]);
    toast.success("Blockchain cache cleared");
  };

  return (
    <BlockchainContext.Provider
      value={{
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
        isContractsInitialized: !!(kycContract && trustScoreContract && loanContract),
        connectWallet,
        disconnectWallet,
        switchNetwork,
        submitKYC,
        verifyKYC,
        getKYCStatus,
        submitLoanApplication,
        approveLoan,
        rejectLoan,
        getTransactionHistory,
        repayLoan,
        registerBank,
        getUserLoans,
        updateTrustScore,
        getTrustScore,
        clearBlockchainCache,
        isOptimized: true
      }}
    >
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
