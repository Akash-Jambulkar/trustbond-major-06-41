
import { useState, useEffect } from 'react';
import Web3 from "web3";
import { getTransactions, trackTransaction, watchTransaction, Transaction } from "@/utils/transactions";

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
      } catch (error) {
        console.error("Failed to refresh transactions:", error);
        setTransactions([]);
      }
    } else {
      setTransactions([]);
    }
  };

  return {
    transactions,
    refreshTransactions,
    trackTransaction: (
      txHash: string,
      type: string,
      description: string,
      extraData?: Record<string, any>
    ) => {
      if (!account) return null;
      
      const tx = trackTransaction(
        txHash,
        type as any,
        description,
        account, // Use the account from props as userAddress
        networkId || 0,
        extraData
      );
      
      if (web3) {
        watchTransaction(web3, txHash);
      }
      
      return tx;
    }
  };
};
