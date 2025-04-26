
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, RefreshCw, Wallet, ExternalLink } from "lucide-react";
import { TransactionVisualizer } from "@/components/blockchain/TransactionVisualizer";
import { toast } from "sonner";

const BlockchainTransactionsPage = () => {
  const { getTransactionHistory, isConnected, connectWallet, account } = useBlockchain();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transaction history
  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      // Try to load from blockchain first
      let data = [];
      if (isConnected && account) {
        console.log("Loading blockchain transactions for account:", account);
        try {
          const blockchainTxs = await getTransactionHistory();
          if (blockchainTxs && blockchainTxs.length > 0) {
            console.log("Loaded blockchain transactions:", blockchainTxs);
            data = blockchainTxs;
          }
        } catch (err) {
          console.error("Failed to load blockchain transactions:", err);
        }
      }
      
      // If no blockchain transactions or not connected, try database
      if (data.length === 0 && user) {
        console.log("Loading database transactions for user:", user.id);
        const { data: dbTxs, error } = await supabase
          .from('transactions')
          .select('*')
          .or(`user_id.eq.${user.id},from_address.eq.${account || ''}`)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error loading transactions from database:", error);
          toast.error("Failed to load transactions from database");
        } else if (dbTxs && dbTxs.length > 0) {
          console.log("Loaded database transactions:", dbTxs);
          data = dbTxs;
        } else {
          console.log("No transactions found in database");
        }
      }
      
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load transaction history");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTransactions();
  }, [isConnected, account, user]);

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
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Truncate long strings (like hashes and addresses)
  const truncate = (str: string, n: number = 8) => {
    if (!str) return '';
    return str.length > n * 2 
      ? `${str.substring(0, n)}...${str.substring(str.length - n)}`
      : str;
  };
  
  // Format amount with ETH symbol if present
  const formatAmount = (amount: any) => {
    if (!amount) return '-';
    if (typeof amount === 'number' || typeof amount === 'string') {
      return `${amount} ETH`;
    }
    return amount;
  };
  
  // Get transaction description
  const getDescription = (tx: any) => {
    return tx.description || formatTransactionType(tx.type);
  };

  const getExplorerUrl = (txHash: string) => {
    if (!txHash || txHash.startsWith('db-')) return null;
    return `https://etherscan.io/tx/${txHash}`;
  };

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10">
              <h3 className="text-xl font-medium text-center mb-2">Please Log In</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Log in to view your transaction history
              </p>
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
        <Card>
          <CardHeader>
            <CardTitle>Transaction Visualization</CardTitle>
            <CardDescription>Visual representation of your transactions</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              {isConnected ? (
                transactions.length > 0 ? (
                  <div className="text-center">Transaction data visualization would appear here</div>
                ) : (
                  <div>No transaction data to visualize</div>
                )
              ) : (
                <div>Connect wallet to visualize transactions</div>
              )}
            </div>
          </CardContent>
        </Card>

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

      {/* Wallet Connect Card (if not connected) */}
      {!isConnected && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-6">
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
      )}

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
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id || tx.hash || `${tx.transaction_hash}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b last:border-b-0"
                    >
                      <TableCell className="font-mono text-xs">
                        {truncate(tx.transaction_hash || tx.hash || 'Unknown', 10)}
                      </TableCell>
                      <TableCell>
                        {formatTransactionType(tx.type)}
                      </TableCell>
                      <TableCell>
                        {formatAmount(tx.amount || tx.metadata?.amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tx.status)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatDate(tx.created_at || tx.timestamp)}
                      </TableCell>
                      <TableCell>
                        {getExplorerUrl(tx.transaction_hash || tx.hash) ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => window.open(getExplorerUrl(tx.transaction_hash || tx.hash), '_blank')}
                            className="flex items-center gap-1"
                          >
                            <span>View</span>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Local</span>
                        )}
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
