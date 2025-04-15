import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMode } from "./ModeContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
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
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [isGanache, setIsGanache] = useState<boolean>(false);
  const [isBlockchainLoading, setIsBlockchainLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Initialize blockchain connection if enabled
  useEffect(() => {
    if (enableBlockchain) {
      // Check for saved connection
      const savedAccount = localStorage.getItem('blockchain_account');
      if (savedAccount) {
        setAccount(savedAccount);
        setIsConnected(true);
        setNetworkName("Development Network");
        setIsCorrectNetwork(true);
        setIsGanache(true);
      }
    } else {
      // Reset state if blockchain is disabled
      setAccount(null);
      setIsConnected(false);
      setNetworkName("Not Connected");
      setIsCorrectNetwork(false);
      setIsGanache(false);
    }
  }, [enableBlockchain]);

  // Connect wallet function
  const connectWallet = async (): Promise<string | false> => {
    if (!enableBlockchain) {
      toast.error("Blockchain features are disabled");
      return false;
    }

    setIsBlockchainLoading(true);
    setConnectionError(null);

    try {
      // In a real implementation, this would connect to MetaMask or another wallet
      // For demo purposes, we'll simulate a connection
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate connection delay
      
      const mockAccount = `0x${Math.random().toString(16).substring(2, 14)}${Math.random().toString(16).substring(2, 14)}`;
      setAccount(mockAccount);
      setIsConnected(true);
      setNetworkName("Development Network");
      setIsCorrectNetwork(true);
      setIsGanache(true);
      
      // Save connection
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

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setNetworkName("Not Connected");
    setIsCorrectNetwork(false);
    setIsGanache(false);
    
    // Remove saved connection
    localStorage.removeItem('blockchain_account');
    
    toast.success("Wallet disconnected");
  };

  // Switch network function
  const switchNetwork = async (chainId: number) => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }

    try {
      // In a real implementation, this would request the wallet to switch networks
      // For demo purposes, we'll simulate a network switch
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate switch delay
      
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

  // Submit KYC document to blockchain
  const submitKYC = async (documentHash: string) => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }

    if (!user) {
      toast.error("User not authenticated");
      return false;
    }

    try {
      // Generate transaction hash
      const transactionHash = generateMockTransactionHash();
      
      // Store KYC document in database
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

      // Update user profile KYC status
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

      return true;
    } catch (error) {
      console.error("KYC submission error:", error);
      toast.error("Failed to submit KYC document");
      return false;
    }
  };

  // Verify KYC document (for bank users)
  const verifyKYC = async (kycId: string, verificationStatus: 'verified' | 'rejected') => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }

    if (!user || user.role !== 'bank') {
      toast.error("Unauthorized operation");
      return false;
    }

    try {
      // Generate transaction hash
      const transactionHash = generateMockTransactionHash();
      
      // Get KYC document
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

      // Update user profile KYC status
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

  // Submit loan application
  const submitLoanApplication = async (loanData: any) => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return null;
    }

    if (!user) {
      toast.error("User not authenticated");
      return null;
    }

    try {
      // Generate transaction hash
      const transactionHash = generateMockTransactionHash();
      
      // Store loan application in database
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

      // Record transaction
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

  // Approve loan (for bank users)
  const approveLoan = async (loanId: string) => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }

    if (!user || user.role !== 'bank') {
      toast.error("Unauthorized operation");
      return false;
    }

    try {
      // Generate transaction hash
      const transactionHash = generateMockTransactionHash();
      
      // Get loan data
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

      // Update loan status
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

      // Record transaction
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

  // Reject loan (for bank users)
  const rejectLoan = async (loanId: string) => {
    if (!enableBlockchain || !isConnected) {
      toast.error("Wallet not connected");
      return false;
    }

    if (!user || user.role !== 'bank') {
      toast.error("Unauthorized operation");
      return false;
    }

    try {
      // Update loan status
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

  // Get transaction history
  const getTransactionHistory = async () => {
    if (!user) {
      return [];
    }

    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by user role
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

      return data || [];
    } catch (error) {
      console.error("Transaction history error:", error);
      return [];
    }
  };

  // Get KYC status for a user
  const getKYCStatus = async (address: string) => {
    if (!enableBlockchain || !isConnected) {
      return false;
    }

    try {
      // In a real implementation, this would check the blockchain
      // For demo purposes, we'll check the database
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

  // Simulate blockchain event
  const simulateBlockchainEvent = async () => {
    if (!enableBlockchain || !isConnected || !user) {
      toast.error("Wallet not connected");
      return;
    }

    // Generate random event type
    const eventTypes = ['kyc', 'loan', 'verification', 'repayment'];
    const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    // Generate transaction hash
    const transactionHash = generateMockTransactionHash();

    // Simulate transaction
    try {
      await supabase
        .from('transactions')
        .insert([
          {
            transaction_hash: transactionHash,
            type: randomEventType,
            from_address: account,
            status: 'confirmed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: user.user_id
          }
        ]);
      toast.success("Simulated blockchain event created");
    } catch (error) {
      console.error("Simulation error:", error);
      toast.error("Failed to simulate blockchain event");
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        account,
        isConnected,
        networkName,
        isCorrectNetwork,
        isGanache,
        isBlockchainLoading,
        connectionError,
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
        simulateBlockchainEvent
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

// Hook to use blockchain context
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};
