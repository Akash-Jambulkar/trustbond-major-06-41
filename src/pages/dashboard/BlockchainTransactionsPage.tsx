
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeUpdates, RealTimeEventType } from "@/contexts/RealTimeContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, RefreshCw, Wallet } from "lucide-react";
import TransactionVisualizer from "@/components/blockchain/TransactionVisualizer";

const BlockchainTransactionsPage = () => {
  const { getTransactionHistory, isConnected, connectWallet } = useBlockchain();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transaction history
  const loadTransactions = async () => {
    setIsLoading(true);
    const data = await getTransactionHistory();
    setTransactions(data);
    setIsLoading(false);
  };

  // Initial load
  useEffect(() => {
    if (isConnected) {
      loadTransactions();
    } else {
      setIsLoading(false);
    }
  }, [isConnected]);

  // Subscribe to real-time updates
  useRealTimeUpdates(RealTimeEventType.TRANSACTION_UPDATED, (payload) => {
    // Check if this is a new transaction
    const isNew = !transactions.some(tx => tx.id === payload.new.id);
    
    if (isNew) {
      setTransactions(prev => [payload.new, ...prev]);
    } else {
      // Update existing transaction
      setTransactions(prev => 
        prev.map(tx => tx.id === payload.new.id ? payload.new : tx)
      );
    }
  });

  // Format transaction type for display
  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'kyc':
        return 'KYC Verification';
      case 'loan':
        return 'Loan Transaction';
      case 'verification':
        return 'Document Verification';
      case 'repayment':
        return 'Loan Repayment';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Get status badge based on transaction status
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
            <XCircle className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Truncate long strings (like hashes and addresses)
  const truncate = (str: string, n: number = 8) => {
    if (!str) return '';
    return str.length > n * 2 
      ? `${str.substring(0, n)}...${str.substring(str.length - n)}`
      : str;
  };

  if (!isConnected) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10">
              <Wallet className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-center mb-2">Wallet Not Connected</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Connect your wallet to view blockchain transactions and interact with smart contracts
              </p>
              <Button onClick={connectWallet}>
                Connect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Blockchain Transactions</h1>
        <p className="text-muted-foreground">
          View and monitor all blockchain transactions related to your account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Transactions Visualizer */}
        <TransactionVisualizer />

        {/* Transaction Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>
              Overview of your blockchain activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-blue-500 text-sm font-medium mb-1">Total Transactions</div>
                <div className="text-2xl font-bold">{transactions.length}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-green-500 text-sm font-medium mb-1">Confirmed</div>
                <div className="text-2xl font-bold">
                  {transactions.filter(tx => tx.status === 'confirmed').length}
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="text-amber-500 text-sm font-medium mb-1">Pending</div>
                <div className="text-2xl font-bold">
                  {transactions.filter(tx => tx.status === 'pending').length}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-red-500 text-sm font-medium mb-1">Failed</div>
                <div className="text-2xl font-bold">
                  {transactions.filter(tx => tx.status === 'failed').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Complete record of your blockchain transactions
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadTransactions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center">
              <RefreshCw className="h-10 w-10 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction Hash</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b last:border-b-0"
                    >
                      <TableCell className="font-mono text-xs">
                        {truncate(tx.transaction_hash, 10)}
                      </TableCell>
                      <TableCell>
                        {formatTransactionType(tx.type)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {truncate(tx.from_address || 'N/A')}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {truncate(tx.to_address || 'N/A')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tx.status)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatDate(tx.created_at)}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainTransactionsPage;
