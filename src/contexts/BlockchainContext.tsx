
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMode } from "@/contexts/ModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { BlockchainContextType } from "@/contexts/blockchain/types";
import { useBlockchainConnection } from "@/contexts/blockchain/useBlockchainConnection";
import { useTransactionManagement } from "@/contexts/blockchain/useTransactionManagement";
import { useContractInteractions } from "@/contexts/blockchain/useContractInteractions";
import { safeFrom } from "@/utils/supabase-utils";

// Create blockchain context
const BlockchainContext = createContext<BlockchainContextType | null>(null);

// Provider component
export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { enableBlockchain } = useMode();
  const { user } = useAuth();

  // Use our custom hooks to manage different aspects of blockchain functionality
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

  const { 
    transactions,
    refreshTransactions,
    trackTransaction
  } = useTransactionManagement({ 
    account, 
    web3, 
    networkId 
  });

  const {
    submitKYC,
    verifyKYC,
    getKYCStatus,
    updateTrustScore,
    getTrustScore,
    requestLoan,
    approveLoan,
    rejectLoan,
    repayLoan,
    getUserLoans,
    registerBank
  } = useContractInteractions({
    web3,
    account,
    kycContract,
    trustScoreContract,
    loanContract,
    isConnected,
    networkId,
    trackAndWatchTransaction: trackTransaction,
    refreshTransactions
  });

  // Get all context values
  const contextValue: BlockchainContextType = {
    web3,
    account,
    networkId,
    networkName,
    isConnected,
    isCorrectNetwork,
    isGanache,
    isBlockchainLoading,
    connectionError,
    transactions,
    kycContract,
    trustScoreContract,
    loanContract,
    isContractsInitialized: !!(kycContract && trustScoreContract && loanContract),
    kycStatus: 'pending',
    connectWallet,
    disconnectWallet,
    submitKYC,
    getKYCStatus,
    verifyKYC,
    getTransactionHistory: refreshTransactions,
    switchNetwork,
    registerBank,
    repayLoan,
    approveLoan,
    rejectLoan,
    submitLoanApplication: requestLoan
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
