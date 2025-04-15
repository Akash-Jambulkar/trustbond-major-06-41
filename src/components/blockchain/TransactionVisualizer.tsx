
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useRealTimeUpdates, RealTimeEventType } from "@/contexts/RealTimeContext";
import { TransactionBadge } from "./TransactionBadge";
import { TransactionItem } from "./TransactionItem";
import { SkeletonTransactionList } from "./SkeletonTransactionList";

export const TransactionVisualizer = () => {
  const { getTransactionHistory } = useBlockchain();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use TRANSACTION_CREATED from RealTimeEventType
  useRealTimeUpdates(RealTimeEventType.TRANSACTION_CREATED, () => {
    loadTransactions();
  });
  
  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const history = await getTransactionHistory();
      setTransactions(history);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (tx: any) => {
    console.log("View transaction details:", tx);
    // Implement transaction details view functionality here
  };

  useEffect(() => {
    loadTransactions();
  }, [getTransactionHistory]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <SkeletonTransactionList />
        ) : transactions.length > 0 ? (
          <ul className="divide-y divide-border">
            {transactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </ul>
        ) : (
          <div className="py-4 px-6 text-center text-muted-foreground">
            No transactions found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
