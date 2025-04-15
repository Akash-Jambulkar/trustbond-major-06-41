
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { RealTimeEventType, useRealTimeUpdates } from "@/utils/realTimeData";
import { Transaction, TransactionType } from "@/utils/transactions/types";
import { CheckCircle, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TransactionVisualizer = () => {
  const { transactions, isConnected, account } = useBlockchain();
  const [activeTransactions, setActiveTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const animationRef = useRef<number | null>(null);
  const [lastTransactionTime, setLastTransactionTime] = useState<Date | null>(null);

  // Initialize active transactions from context
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Get the 5 most recent transactions
      const recent = [...transactions]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);
      
      setRecentTransactions(recent);
    }
  }, [transactions]);

  // Listen for real-time transaction updates
  useRealTimeUpdates(RealTimeEventType.TRANSACTION_UPDATED, (data) => {
    // Add the new transaction to the visualizer
    if (data && data.hash) {
      const newTx: Transaction = {
        hash: data.hash,
        timestamp: data.timestamp || Date.now(),
        status: data.status || 'pending',
        type: data.type || 'other',
        description: data.description || 'Transaction',
        account: data.from_address || account || '',
        network: data.network || '0',
        blockNumber: data.blockNumber
      };

      // Add to active transactions for animation
      setActiveTransactions(prev => [...prev, newTx]);
      
      // Update the recent transactions list
      setRecentTransactions(prev => {
        const updated = [newTx, ...prev].slice(0, 5);
        return updated;
      });

      // Update the last transaction time
      setLastTransactionTime(new Date());

      // Remove from active after animation
      setTimeout(() => {
        setActiveTransactions(prev => prev.filter(tx => tx.hash !== newTx.hash));
      }, 5000);
    }
  });

  // Get the status icon based on transaction status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-amber-600" />;
    }
  };

  // Get the transaction type badge
  const getTypeBadge = (type: TransactionType) => {
    let color = "";
    
    switch (type) {
      case 'kyc':
        color = "bg-purple-100 text-purple-800 border-purple-200";
        break;
      case 'verification':
        color = "bg-green-100 text-green-800 border-green-200";
        break;
      case 'loan':
        color = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      case 'registration':
        color = "bg-amber-100 text-amber-800 border-amber-200";
        break;
      default:
        color = "bg-gray-100 text-gray-800 border-gray-200";
    }
    
    return (
      <Badge variant="outline" className={`${color} text-xs capitalize`}>
        {type}
      </Badge>
    );
  };

  // Format timestamp relative to now
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 60000) { // less than 1 minute
      return 'Just now';
    }
    
    if (diffMs < 3600000) { // less than 1 hour
      const mins = Math.floor(diffMs / 60000);
      return `${mins} min${mins > 1 ? 's' : ''} ago`;
    }
    
    if (diffMs < 86400000) { // less than 1 day
      const hours = Math.floor(diffMs / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    const days = Math.floor(diffMs / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  if (!isConnected) {
    return (
      <Alert className="bg-amber-50 border-amber-200 mt-4">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle>Wallet not connected</AlertTitle>
        <AlertDescription>
          Connect your blockchain wallet to visualize transaction activity.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Real-time Blockchain Activity</span>
          {lastTransactionTime && (
            <Badge variant="outline" className="ml-2 text-xs">
              Last activity: {formatTimestamp(lastTransactionTime.getTime())}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Visualize real-time blockchain transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Transactions Activity Stream */}
        <div className="space-y-4">
          {/* Active Transactions Animation */}
          <div className="h-12 relative overflow-hidden border-l-2 border-dashed border-gray-200 pl-4">
            {activeTransactions.length === 0 && (
              <div className="text-sm text-gray-500 flex items-center h-full">
                <span>Waiting for transactions...</span>
              </div>
            )}
            
            {activeTransactions.map((tx) => (
              <div 
                key={tx.hash}
                className="flex items-center gap-2 absolute left-4 transition-all duration-[3000ms] ease-out"
                style={{
                  transform: "translateX(0)",
                  animation: "slideRight 5s ease-out forwards"
                }}
              >
                {getStatusIcon(tx.status)}
                <div className="text-sm font-medium truncate max-w-[180px]">
                  {tx.description}
                </div>
                {getTypeBadge(tx.type)}
              </div>
            ))}
          </div>
          
          {/* Recent Transactions List */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Recent Transactions</h4>
            {recentTransactions.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">No transactions yet</div>
            ) : (
              <div className="space-y-2">
                {recentTransactions.map((tx) => (
                  <div 
                    key={tx.hash}
                    className="p-2 border rounded-md flex items-center justify-between gap-2 bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <div>
                        <div className="text-sm font-medium">{tx.description}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          {tx.hash.substring(0, 6)}...{tx.hash.substring(tx.hash.length - 4)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(tx.type)}
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(tx.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideRight {
            0% {
              transform: translateX(0);
              opacity: 1;
            }
            80% {
              opacity: 1;
            }
            100% {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `
      }} />
    </Card>
  );
};
