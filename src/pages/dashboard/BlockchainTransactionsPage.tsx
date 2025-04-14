
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionHistory } from "@/components/blockchain/TransactionHistory";

const BlockchainTransactionsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Blockchain Transactions</h1>
      
      <TransactionHistory />
    </div>
  );
};

export default BlockchainTransactionsPage;
