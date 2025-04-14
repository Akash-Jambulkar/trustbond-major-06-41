
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTransactions, type Transaction } from "@/utils/transactions";
import { TransactionList } from "./TransactionList";
import { TransactionDetailsDialog } from "./TransactionDetailsDialog";

export const TransactionHistory = () => {
  const { account, isConnected } = useBlockchain();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load transactions whenever the account changes
  useEffect(() => {
    const fetchTransactions = async () => {
      if (isConnected && account) {
        setIsLoading(true);
        try {
          const txs = await getTransactions(account);
          setTransactions(txs);
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, [account, isConnected]);

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === "all") return true;
    return tx.type === activeTab;
  });
  
  // Open transaction details modal
  const openTxDetails = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsDetailsOpen(true);
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
          
          <TransactionList
            transactions={filteredTransactions}
            onViewDetails={openTxDetails}
            isLoading={isLoading}
            isConnected={isConnected}
          />
        </Tabs>
        
        <TransactionDetailsDialog 
          transaction={selectedTx}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      </CardContent>
    </Card>
  );
};
