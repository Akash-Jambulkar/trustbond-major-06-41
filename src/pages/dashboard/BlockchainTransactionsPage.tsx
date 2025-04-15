
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionHistory } from "@/components/blockchain/TransactionHistory";
import { TransactionVisualizer } from "@/components/blockchain/TransactionVisualizer";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BlockchainTransactionsPage = () => {
  const { isConnected, refreshTransactions } = useBlockchain();
  
  // Refresh transactions when the page loads
  useEffect(() => {
    if (isConnected) {
      refreshTransactions();
    }
  }, [isConnected, refreshTransactions]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blockchain Transactions</h1>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-trustbond-primary" />
          <span className="text-sm font-medium">Secured by Blockchain</span>
        </div>
      </div>
      
      {!isConnected && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800 mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Connect your blockchain wallet to view transaction history.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View and audit all blockchain transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionHistory />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <TransactionVisualizer />
        </div>
      </div>
    </div>
  );
};

export default BlockchainTransactionsPage;
