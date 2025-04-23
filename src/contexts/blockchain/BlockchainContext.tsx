
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
      if (isConnected && account && user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('kyc_status')
            .eq('user_id', user.user_id)
            .single();
          
          if (error) throw error;
          
          if (data && data.kyc_status) {
            setKycStatus(data.kyc_status as 'not_verified' | 'pending' | 'verified' | 'rejected');
          }
        } catch (error) {
          console.error("Error checking KYC status:", error);
        }
      } else {
        setKycStatus('not_verified');
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockAccount = `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`;
      setAccount(mockAccount);
      setIsConnected(true);
      setNetworkName("Development Network");
      setIsCorrectNetwork(true);
      setIsGanache(true);
      
      localStorage.setItem('blockchain_account', mockAccount);
      
      toast.success("Wallet connected successfully!");
      return mockAccount;
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      setConnectionError(error.message || "Failed to connect wallet");
      toast.error("Failed to connect wallet");
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
      
      const { error: kycError } = await supabase
        .from('kyc_documents')
        .insert([
          {
            user_id: user.user_id,
            document_type: 'identity',
            document_hash: documentHash,
            verification_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (kycError) {
        console.error("KYC document storage error:", kycError);
        toast.error("Failed to store KYC document");
        return false;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ kyc_status: 'pending' })
        .eq('user_id', user.user_id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast.error("Failed to update KYC status");
        return false;
      }

      try {
        await supabase
          .from('transactions')
          .insert([
            {
              transaction_hash: transactionHash,
              type: 'kyc',
              from_address: account,
              status: 'confirmed',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: user.user_id
            }
          ]);
        toast.success("KYC document submitted successfully!");
      } catch (error) {
        console.error("Transaction record error:", error);
        toast.error("Failed to submit KYC document");
        return false;
      }

      setKycStatus('pending');
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

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ kyc_status: verificationStatus })
        .eq('user_id', kycData.user_id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast.error("Failed to update user KYC status");
        return false;
      }

      try {
        await supabase
          .from('transactions')
          .insert([
            {
              transaction_hash: transactionHash,
              type: 'verification',
              from_address: account,
              to_address: kycData.user_id,
              amount: 0,
              status: 'confirmed',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: kycData.user_id,
              bank_id: user.user_id
            }
          ]);
        toast.success(`KYC document ${verificationStatus}`);
      } catch (error) {
        console.error("Transaction record error:", error);
        toast.error("Failed to verify KYC document");
        return false;
      }

      return true;
    } catch (error) {
      console.error("KYC verification error:", error);
      toast.error("Failed to verify KYC document");
      return false;
    }
  };

  const submitLoanApplication = async (loanData: any): Promise<string | null> => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return null;
    }

    if (!user) {
      toast.error("User not authenticated");
      return null;
    }

    try {
      const transactionHash = generateMockTransactionHash();
      
      const { data: loanInsertData, error: loanError } = await supabase
        .from('loans')
        .insert([
          {
            user_id: user.user_id,
            bank_id: loanData.bankId,
            amount: loanData.amount,
            interest_rate: loanData.interestRate,
            term_months: loanData.termMonths,
            status: 'pending',
            purpose: loanData.purpose,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            blockchain_address: account
          }
        ])
        .select()
        .single();

      if (loanError) {
        console.error("Loan application storage error:", loanError);
        toast.error("Failed to store loan application");
        return null;
      }

      try {
        await supabase
          .from('transactions')
          .insert([
            {
              transaction_hash: transactionHash,
              type: 'loan',
              from_address: account,
              to_address: loanData.bankId,
              amount: loanData.amount,
              status: 'confirmed',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: user.user_id,
              bank_id: loanData.bankId
            }
          ]);
        toast.success("Loan application submitted successfully!");
      } catch (error) {
        console.error("Transaction record error:", error);
        toast.error("Failed to submit loan application");
        return null;
      }

      return loanInsertData.id;
    } catch (error) {
      console.error("Loan application error:", error);
      toast.error("Failed to submit loan application");
      return null;
    }
  };

  const approveLoan = async (loanId: string): Promise<boolean> => {
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
      
      const { data: loanData, error: loanFetchError } = await supabase
        .from('loans')
        .select('user_id, amount')
        .eq('id', loanId)
        .eq('bank_id', user.user_id)
        .single();

      if (loanFetchError || !loanData) {
        console.error("Loan fetch error:", loanFetchError);
        toast.error("Failed to fetch loan data");
        return false;
      }

      const { error: loanUpdateError } = await supabase
        .from('loans')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', loanId);

      if (loanUpdateError) {
        console.error("Loan update error:", loanUpdateError);
        toast.error("Failed to update loan status");
        return false;
      }

      try {
        await supabase
          .from('transactions')
          .insert([
            {
              transaction_hash: transactionHash,
              type: 'loan',
              from_address: account,
              to_address: loanData.user_id,
              amount: loanData.amount,
              status: 'confirmed',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: loanData.user_id,
              bank_id: user.user_id
            }
          ]);
        toast.success("Loan approved successfully!");
      } catch (error) {
        console.error("Transaction record error:", error);
        toast.error("Failed to approve loan");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Loan approval error:", error);
      toast.error("Failed to approve loan");
      return false;
    }
  };

  const rejectLoan = async (loanId: string): Promise<boolean> => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }

    if (!user || user.role !== 'bank') {
      toast.error("Unauthorized operation");
      return false;
    }

    try {
      const { error: loanUpdateError } = await supabase
        .from('loans')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', loanId)
        .eq('bank_id', user.user_id);

      if (loanUpdateError) {
        console.error("Loan update error:", loanUpdateError);
        toast.error("Failed to update loan status");
        return false;
      }

      toast.success("Loan rejected");
      return true;
    } catch (error) {
      console.error("Loan rejection error:", error);
      toast.error("Failed to reject loan");
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
        return [];
      }

      // Update the transactions state
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
      if (user) {
        const { data, error } = await supabase
          .from('kyc_documents')
          .select('verification_status')
          .eq('user_id', user.user_id)
          .single();

        if (error) throw error;
        return data?.verification_status === 'verified';
      }
      return false;
    } catch (error) {
      console.error("KYC status check error:", error);
      return false;
    }
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
        transactions, // Add the transactions property
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
        registerBank
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
