
import React, { createContext, useContext, ReactNode } from "react";
import { useMode } from "@/contexts/ModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { BlockchainContextType } from "./types/contextTypes";
import { useBlockchainConnection } from "./useBlockchainConnection";
import { useTransactionManagement } from "./useTransactionManagement";
import { useContractInteractions } from "./useContractInteractions";

const BlockchainContext = createContext<BlockchainContextType | null>(null);

export const BlockchainStateProvider = ({ children }: { children: ReactNode }) => {
  const { enableBlockchain } = useMode();
  const { user } = useAuth();

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
    refreshTransactions: getTransactionHistory,
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
    requestLoan: submitLoanApplication,
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
    refreshTransactions: getTransactionHistory
  });

  // Create a wrapper for submitKYC to maintain backward compatibility
  const submitKYCWrapper = async (documentHash: string, feeInWei?: string): Promise<boolean> => {
    const result = await submitKYC(documentHash, 'default', feeInWei);
    return result.success;
  };

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
    submitKYC: submitKYCWrapper,
    getKYCStatus,
    verifyKYC,
    getTransactionHistory,
    switchNetwork,
    registerBank,
    repayLoan,
    approveLoan,
    rejectLoan,
    submitLoanApplication,
    updateTrustScore,
    getTrustScore,
    getUserLoans
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
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
