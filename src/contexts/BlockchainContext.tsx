
import { createContext, useContext, ReactNode } from "react";
import { useMode } from "@/contexts/ModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchainConnection } from "./blockchain/useBlockchainConnection";
import { BlockchainContextType } from "@/contexts/blockchain/types";
import { submitKYCDocument, verifyKYCDocument, getKYCDocumentStatus } from "@/utils/blockchain/kycOperations";
import { submitLoanRequest, approveLoanRequest, rejectLoanRequest, repayLoanRequest } from "@/utils/blockchain/loanOperations";
import { getTransactionHistoryFromDb, simulateBlockchainEventInDb } from "@/utils/blockchain/transactionUtils";
import { registerBankOnBlockchain } from "@/utils/blockchain/bankOperations";

// Create blockchain context
const BlockchainContext = createContext<BlockchainContextType | null>(null);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { enableBlockchain } = useMode();
  const { user } = useAuth();
  
  // Use the real Web3 connection hook
  const {
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
  } = useBlockchainConnection({ enableBlockchain });

  // Function to submit KYC to blockchain
  const submitKYC = async (documentHash: string) => {
    if (!isConnected || !kycContract || !account || !user?.id) {
      console.error("Cannot submit KYC: missing requirements");
      return false;
    }
    
    return await submitKYCDocument({
      web3,
      kycContract, 
      account, 
      documentHash, 
      userId: user.id
    });
  };

  // Function to verify KYC (for bank users)
  const verifyKYC = async (kycId: string, verificationStatus: 'verified' | 'rejected') => {
    if (!isConnected || !kycContract || !account || !user?.id || user.role !== 'bank') {
      console.error("Cannot verify KYC: missing requirements or incorrect role");
      return false;
    }
    
    return await verifyKYCDocument({
      web3,
      kycContract,
      account,
      kycId,
      verificationStatus,
      bankId: user.id
    });
  };

  // Get KYC status for a user
  const getKYCStatus = async (address: string) => {
    if (!isConnected || !kycContract) {
      return false;
    }
    
    return await getKYCDocumentStatus(kycContract, address);
  };

  // Submit loan application
  const submitLoanApplication = async (loanData: any) => {
    if (!isConnected || !loanContract || !account || !user?.id) {
      console.error("Cannot submit loan: missing requirements");
      return null;
    }
    
    return await submitLoanRequest({
      web3,
      loanContract,
      account,
      loanData,
      userId: user.id
    });
  };

  // Approve loan (for bank users)
  const approveLoan = async (loanId: string) => {
    if (!isConnected || !loanContract || !account || !user?.id || user.role !== 'bank') {
      console.error("Cannot approve loan: missing requirements or incorrect role");
      return false;
    }
    
    return await approveLoanRequest({
      web3,
      loanContract,
      account,
      loanId,
      bankId: user.id
    });
  };

  // Reject loan (for bank users)
  const rejectLoan = async (loanId: string) => {
    if (!isConnected || !loanContract || !account || !user?.id || user.role !== 'bank') {
      console.error("Cannot reject loan: missing requirements or incorrect role");
      return false;
    }
    
    return await rejectLoanRequest({
      web3,
      loanContract,
      account,
      loanId,
      bankId: user.id
    });
  };

  // Repay loan (for borrowers)
  const repayLoan = async (loanId: string, amount: string) => {
    if (!isConnected || !loanContract || !account || !user?.id) {
      console.error("Cannot repay loan: missing requirements");
      return false;
    }
    
    return await repayLoanRequest({
      web3,
      loanContract,
      account,
      loanId,
      amount,
      userId: user.id
    });
  };

  // Register bank function
  const registerBank = async (bankData: any) => {
    if (!isConnected || !account || !user?.id) {
      console.error("Cannot register bank: missing requirements");
      return false;
    }
    
    return await registerBankOnBlockchain({
      web3,
      account,
      bankData,
      userId: user.id
    });
  };

  // Get transaction history
  const getTransactionHistory = async () => {
    if (!user?.id) {
      return [];
    }
    
    return await getTransactionHistoryFromDb(user.id, user.role);
  };

  // Simulate blockchain event - only for development
  const simulateBlockchainEvent = async () => {
    if (!isConnected || !account || !user?.id) {
      console.error("Cannot simulate event: missing requirements");
      return;
    }
    
    return await simulateBlockchainEventInDb(account, user.id);
  };

  return (
    <BlockchainContext.Provider
      value={{
        web3,
        account,
        isConnected,
        networkName,
        networkId,
        isCorrectNetwork,
        isGanache,
        isBlockchainLoading,
        connectionError,
        kycContract,
        trustScoreContract,
        loanContract,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        submitKYC,
        verifyKYC,
        getKYCStatus,
        submitLoanApplication,
        approveLoan,
        rejectLoan,
        repayLoan,
        registerBank,
        getTransactionHistory,
        simulateBlockchainEvent,
        kycStatus: 'not_verified' // Add a default value for kycStatus
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
