
import React, { createContext, useContext, ReactNode, useState } from "react";
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
  const [isOptimized, setIsOptimized] = useState<boolean>(true); // Default to optimized mode

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
    networkId,
    isOptimized
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
    registerBank,
    clearBlockchainCache
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

  // Create a wrapper for requestLoan to match the expected interface
  const submitLoanApplication = async (loanData: any): Promise<string | null> => {
    const result = await requestLoan(
      loanData.amount.toString(), 
      loanData.purpose || 'General Purpose', 
      loanData.termMonths || 12
    );
    return result ? loanData.loanId || 'pending-id' : null;
  };

  // Create a wrapper for rejectLoan to match the expected interface
  const rejectLoanWrapper = async (loanId: string): Promise<boolean> => {
    return await rejectLoan(loanId, 'Rejected by bank');
  };

  // Create a wrapper for registerBank to match the expected interface
  const registerBankWrapper = async (bankData: any): Promise<boolean> => {
    return await registerBank(
      bankData.name || 'Bank', 
      bankData.regNumber || bankData.registrationNumber || '12345'
    );
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
    registerBank: registerBankWrapper,
    repayLoan,
    approveLoan,
    rejectLoan: rejectLoanWrapper,
    submitLoanApplication,
    updateTrustScore,
    getTrustScore,
    getUserLoans,
    clearBlockchainCache,
    isOptimized
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
