
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { getTransactions, type Transaction } from "@/utils/transactionTracker";

export const TransactionHistory = () => {
  const { account, isConnected } = useBlockchain();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Load transactions whenever the account changes
  useEffect(() => {
    if (isConnected && account) {
      const userTransactions = getTransactions(account);
      setTransactions(userTransactions);
    } else {
      setTransactions([]);
    }
  }, [account, isConnected]);

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === "all") return true;
    return tx.type === activeTab;
  });

  // Get status badge for transaction
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Confirmed</span>
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get transaction type name
  const getTypeName = (type: string) => {
    switch (type) {
      case 'kyc': return 'KYC Submission';
      case 'verification': return 'Document Verification';
      case 'loan': return 'Loan Operation';
      default: return 'Other Transaction';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View your blockchain transaction history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="verification">Verifications</TabsTrigger>
            <TabsTrigger value="loan">Loans</TabsTrigger>
          </TabsList>
          
          {transactions.length > 0 ? (
            <div className="space-y-3 mt-4">
              {filteredTransactions.map((tx) => (
                <div key={tx.hash} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{tx.description}</h3>
                      <p className="text-sm text-gray-500">{formatDate(tx.timestamp)}</p>
                      <div className="flex gap-1 items-center mt-1">
                        <span className="text-xs text-gray-500 font-mono">
                          {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                        </span>
                        <a 
                          href={`https://${tx.network === 1337 ? 'localhost:8545' : 'etherscan.io'}/tx/${tx.hash}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-trustbond-primary inline-flex items-center"
                        >
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(tx.status)}
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {getTypeName(tx.type)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {!isConnected ? 
                "Connect your wallet to view transactions" : 
                "No transactions found"
              }
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
