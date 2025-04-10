
import { useEffect, useState } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useMode } from "@/contexts/ModeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  hash: string;
  timestamp: number;
  status: "confirmed" | "pending" | "failed";
  type: "kyc" | "loan" | "verification" | "other";
  description: string;
}

export const TransactionHistory = () => {
  const { web3, account, networkName } = useBlockchain();
  const { enableBlockchain, isDemoMode } = useMode();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If in demo mode, show demo transactions
    if (isDemoMode) {
      setTransactions(getDemoTransactions());
      setIsLoading(false);
      return;
    }

    // Only fetch if blockchain is enabled and account is connected
    if (!enableBlockchain || !web3 || !account) {
      setIsLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        
        // Get transaction history from local storage as a temporary solution
        // In a real implementation, you would fetch this from a blockchain indexer or backend
        const storedTx = localStorage.getItem(`transactions_${account.toLowerCase()}`);
        const accountTransactions = storedTx ? JSON.parse(storedTx) : [];
        
        setTransactions(accountTransactions);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [web3, account, enableBlockchain, isDemoMode]);

  // Helper function for demo transactions
  const getDemoTransactions = (): Transaction[] => {
    const now = Date.now();
    return [
      {
        hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        timestamp: now - 3600000, // 1 hour ago
        status: "confirmed",
        type: "kyc",
        description: "KYC Document Submitted"
      },
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        timestamp: now - 86400000, // 1 day ago
        status: "confirmed",
        type: "verification",
        description: "Identity Verification Completed"
      },
      {
        hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        timestamp: now - 172800000, // 2 days ago
        status: "failed",
        type: "loan",
        description: "Loan Request Failed"
      },
      {
        hash: "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
        timestamp: now - 259200000, // 3 days ago
        status: "confirmed",
        type: "loan",
        description: "Loan Approved"
      }
    ];
  };

  // Helper to get transaction status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Confirmed</span>
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">Unknown</Badge>
        );
    }
  };

  // Helper to get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "kyc":
        return <Badge className="bg-blue-500">KYC</Badge>;
      case "loan":
        return <Badge className="bg-purple-500">Loan</Badge>;
      case "verification":
        return <Badge className="bg-green-500">Verification</Badge>;
      default:
        return <Badge>Other</Badge>;
    }
  };

  // Helper to get block explorer URL
  const getExplorerUrl = (txHash: string) => {
    // Different explorers for different networks
    if (networkName === "Ganache") {
      return "#"; // No explorer for local Ganache
    } else if (networkName === "Goerli Testnet") {
      return `https://goerli.etherscan.io/tx/${txHash}`;
    } else {
      return `https://etherscan.io/tx/${txHash}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Recent blockchain transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions found</p>
            {!account && !isDemoMode && (
              <p className="mt-2 text-sm">Connect your wallet to view your transaction history</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.hash} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(tx.type)}
                    <span className="font-medium">{tx.description}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="hidden md:inline truncate max-w-[180px]">{tx.hash}</span>
                    <span className="md:hidden truncate max-w-[180px]">
                      {tx.hash.substring(0, 6)}...{tx.hash.substring(tx.hash.length - 4)}
                    </span>
                    <a 
                      href={getExplorerUrl(tx.hash)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={networkName === "Ganache" ? "hidden" : "inline-flex"}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  {getStatusBadge(tx.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
