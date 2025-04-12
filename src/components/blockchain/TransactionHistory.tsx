
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowUpRight, CheckCircle, Clock, ExternalLink, Eye } from "lucide-react";
import { getTransactions, type Transaction } from "@/utils/transactionTracker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
      case 'registration': return 'Bank Registration';
      default: return 'Other Transaction';
    }
  };
  
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
          
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
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
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(tx.status)}
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {getTypeName(tx.type)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => openTxDetails(tx)}
                          title="View transaction details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
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
        
        {/* Transaction Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Detailed information about this blockchain transaction
              </DialogDescription>
            </DialogHeader>
            
            {selectedTx && (
              <div className="space-y-4 mt-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm">{selectedTx.description}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Transaction Hash</p>
                  <p className="text-sm font-mono break-all">{selectedTx.hash}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Type</p>
                    <p className="text-sm">{getTypeName(selectedTx.type)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Status</p>
                    <div>{getStatusBadge(selectedTx.status)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm">{formatDate(selectedTx.timestamp)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Network</p>
                    <p className="text-sm">
                      {selectedTx.network === 1337 ? "Local Ganache" : `Chain ID: ${selectedTx.network}`}
                    </p>
                  </div>
                </div>
                
                {selectedTx.metadata && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Additional Data</p>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(selectedTx.metadata, null, 2)}
                    </pre>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => window.open(
                      `https://${selectedTx.network === 1337 ? 'localhost:8545' : 'etherscan.io'}/tx/${selectedTx.hash}`, 
                      '_blank'
                    )}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on {selectedTx.network === 1337 ? 'Blockchain Explorer' : 'Etherscan'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
