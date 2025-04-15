
import { createContext, useContext, ReactNode } from "react";
import { useMode } from "../ModeContext";
import { useBlockchainConnection } from "./useBlockchainConnection";
import { useTransactionManagement } from "./useTransactionManagement";
import { useContractInteractions } from "./useContractInteractions";
import { BlockchainContextType } from "./types";

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { enableBlockchain } = useMode();
  
  // Initialize blockchain connection (always production)
  const connection = useBlockchainConnection({ 
    enableBlockchain
  });
  
  // Initialize transaction management
  const transactionManager = useTransactionManagement({
    account: connection.account,
    web3: connection.web3,
    networkId: connection.networkId
  });
  
  // Prepare trackAndWatchTransaction helper for contract interactions
  const trackAndWatchTransaction = (
    txHash: string, 
    type: string, 
    description: string, 
    extraData?: Record<string, any>
  ) => {
    return transactionManager.trackTransaction(
      txHash,
      type,
      description,
      connection.account || "",
      extraData
    );
  };
  
  // Initialize contract interactions
  const contractInteractions = useContractInteractions({
    web3: connection.web3,
    account: connection.account,
    kycContract: connection.kycContract,
    trustScoreContract: connection.trustScoreContract,
    loanContract: connection.loanContract,
    isConnected: connection.isConnected,
    networkId: connection.networkId,
    trackAndWatchTransaction,
    refreshTransactions: transactionManager.refreshTransactions
  });

  // Combine all context values
  const contextValue: BlockchainContextType = {
    ...connection,
    ...contractInteractions,
    transactions: transactionManager.transactions,
    refreshTransactions: transactionManager.refreshTransactions
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};
