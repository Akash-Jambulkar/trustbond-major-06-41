
import { useState, useEffect } from 'react';
import Web3 from "web3";
import { getTransactions, trackTransaction as track, watchTransaction, Transaction } from "@/utils/transactions";

interface UseTransactionManagementProps {
  account: string | null;
  web3: Web3 | null;
  networkId: number | null;
}

export const useTransactionManagement = ({ 
  account, 
  web3, 
  networkId 
}: UseTransactionManagementProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    refreshTransactions();
  }, [account]);

  const refreshTransactions = async () => {
    if (account) {
      try {
        const accountTransactions = await getTransactions(account);
        setTransactions(accountTransactions);
        return accountTransactions;
      } catch (error) {
        console.error("Failed to refresh transactions:", error);
        setTransactions([]);
        return [];
      }
    }
    setTransactions([]);
    return [];
  };

  const trackTransaction = (
    txHash: string,
    type: string,
    description: string,
    extraData?: Record<string, any>
  ) => {
    if (!account || !networkId) return null;
    
    const tx = track(
      txHash,
      type,
      description,
      account,
      networkId,
      extraData
    );
    
    if (web3) {
      watchTransaction(web3, txHash);
    }
    
    return tx;
  };

  return {
    transactions,
    refreshTransactions,
    trackTransaction
  };
};
