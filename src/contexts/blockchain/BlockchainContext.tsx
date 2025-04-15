
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useMode } from "../ModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchainConnection } from "./useBlockchainConnection";
import { useTransactionManagement } from "./useTransactionManagement";
import { useContractInteractions } from "./useContractInteractions";
import { BlockchainContextType } from "./types";
import { setupBasicEventListeners } from "@/utils/eventListener";
import { RealTimeEventType, initializeRealTimeSubscriptions, realTimeEvents } from "@/utils/realTimeData";
import { startSimulation, simulateRandomBlockchainEvent } from "@/utils/simulateBlockchainEvents";
import { toast } from "sonner";

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { enableBlockchain } = useMode();
  const { user } = useAuth(); // Access the user from AuthContext
  
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
      
      // Initialize real-time data subscriptions if account is available
      let unsubscribe: (() => void) | undefined;
      if (connection.account) {
        unsubscribe = initializeRealTimeSubscriptions(connection.account);
        
        // Listen for real-time events and show notifications
        realTimeEvents.on(RealTimeEventType.KYC_UPDATED, (data) => {
          if (data?.verification_status === 'verified') {
            toast.success("KYC verification updated", {
              description: "Your identity verification status has been updated",
            });
          }
        });
        
        realTimeEvents.on(RealTimeEventType.TRUST_SCORE_UPDATED, (data) => {
          toast.success("Trust score updated", {
            description: `Your trust score has been updated to ${data?.score || 'a new value'}`,
          });
        });
        
        realTimeEvents.on(RealTimeEventType.LOAN_UPDATED, (data) => {
          toast.success("Loan status updated", {
            description: `Loan #${data?.id} has been updated to ${data?.status || 'a new status'}`,
          });
        });
      }
      
      toast.success("Real-time blockchain monitoring activated", {
        description: "You'll receive instant notifications for all blockchain events",
        duration: 5000
      });
      
      // For development, start simulation of real-time events
      // In production, this would be replaced by actual blockchain events
      const stopSimulation = startSimulation(15000); // Simulate an event every 15 seconds
      
      // Trigger an initial event to demonstrate real-time updates
      setTimeout(() => {
        simulateRandomBlockchainEvent();
      }, 3000);
      
      // Clean up listeners when component unmounts or connection changes
      return () => {
        realTimeEvents.removeAllListeners(RealTimeEventType.KYC_UPDATED);
        realTimeEvents.removeAllListeners(RealTimeEventType.TRUST_SCORE_UPDATED);
        realTimeEvents.removeAllListeners(RealTimeEventType.LOAN_UPDATED);
        if (unsubscribe) unsubscribe();
        stopSimulation(); // Stop the simulation when unmounting
      };
    }
  }, [connection.isConnected, connection.kycContract, connection.trustScoreContract, connection.loanContract, connection.account]);

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
