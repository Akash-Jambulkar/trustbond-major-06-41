
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

// Transaction type
type Transaction = {
  id: string;
  transaction_hash: string;
  type: string;
  status: string;
  created_at: string;
  from_address?: string;
  to_address?: string;
  amount?: number;
  user_id?: string;
  bank_id?: string;
};

// TransactionList component for displaying transactions
const TransactionList = ({ 
  transactions, 
  onViewDetails, 
  isLoading,
  isConnected 
}: { 
  transactions: Transaction[];
  onViewDetails: (tx: Transaction) => void;
  isLoading: boolean;
  isConnected: boolean;
}) => {
  if (!isConnected) {
    return (
      <div className="text-center py-8 text-gray-500">
        Connect your wallet to view transactions
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions found
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4">
      {transactions.map((tx) => (
        <div 
          key={tx.id} 
          className="p-3 border rounded-md hover:bg-muted cursor-pointer"
          onClick={() => onViewDetails(tx)}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium truncate">{tx.type.toUpperCase()}</div>
              <div className="text-xs text-muted-foreground truncate">
                {tx.transaction_hash.substring(0, 16)}...
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm ${tx.status === 'confirmed' ? 'text-green-600' : 'text-amber-600'}`}>
                {tx.status.toUpperCase()}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// TransactionDetailsDialog component (simplified for now)
const TransactionDetailsDialog = ({ 
  transaction,
  isOpen,
  onOpenChange 
}: { 
  transaction: Transaction | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  // This would be a modal dialog in a real implementation
  return null;
};

export const TransactionHistory = () => {
  const { account, isConnected, getTransactionHistory } = useBlockchain();
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
          const txs = await getTransactionHistory();
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
  }, [account, isConnected, getTransactionHistory]);

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
