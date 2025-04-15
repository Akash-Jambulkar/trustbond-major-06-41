
import { createContext, useContext, ReactNode, useEffect } from "react";
import { useMode } from "../ModeContext";
import { useBlockchainConnection } from "./useBlockchainConnection";
import { useTransactionManagement } from "./useTransactionManagement";
import { useContractInteractions } from "./useContractInteractions";
import { BlockchainContextType } from "./types";
import { setupBasicEventListeners } from "@/utils/eventListener";
import { toast } from "sonner";

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

  // Set up event listeners for real-time updates
  useEffect(() => {
    if (connection.isConnected && 
        connection.kycContract && 
        connection.trustScoreContract && 
        connection.loanContract) {
      
      // Set up basic event listeners for blockchain events
      setupBasicEventListeners(
        connection.kycContract,
        connection.trustScoreContract,
        connection.loanContract
      );
      
      toast.success("Real-time blockchain monitoring activated", {
        description: "You'll receive instant notifications for all blockchain events",
        duration: 5000
      });
    }
    
    // Clean up listeners when component unmounts or connection changes
    return () => {
      // The stopAllEventListeners function is imported and called by setupBasicEventListeners
    };
  }, [connection.isConnected, connection.kycContract, connection.trustScoreContract, connection.loanContract]);

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
