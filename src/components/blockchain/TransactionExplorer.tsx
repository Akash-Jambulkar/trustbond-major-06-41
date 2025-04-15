import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, ExternalLink, AlertCircle, Check, X } from "lucide-react";
import { TransactionStatus } from "@/utils/transactions/types";

export function TransactionExplorer() {
  const { web3, networkId } = useBlockchain();
  const [txHash, setTxHash] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txDetails, setTxDetails] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTransaction = async () => {
    if (!web3 || !txHash) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get transaction receipt
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      
      if (!receipt) {
        // If no receipt, try to get transaction details
        const tx = await web3.eth.getTransaction(txHash);
        
        if (!tx) {
          throw new Error("Transaction not found");
        }
        
        setTxDetails({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: web3.utils.fromWei(tx.value, "ether"),
          blockNumber: tx.blockNumber || "Pending",
          status: tx.blockNumber ? "Pending" : "Unknown",
          gasPrice: web3.utils.fromWei(tx.gasPrice, "gwei"),
          gasLimit: tx.gas,
          nonce: tx.nonce
        });
      } else {
        // Use receipt data
        const tx = await web3.eth.getTransaction(txHash);
        
        setTxDetails({
          hash: receipt.transactionHash,
          from: receipt.from,
          to: receipt.to,
          value: tx ? web3.utils.fromWei(tx.value, "ether") : "0",
          blockNumber: receipt.blockNumber,
          status: receipt.status ? "Success" : "Failed",
          gasPrice: tx ? web3.utils.fromWei(tx.gasPrice, "gwei") : "0",
          gasUsed: receipt.gasUsed,
          cumulativeGasUsed: receipt.cumulativeGasUsed
        });
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
      setError("Failed to fetch transaction details: " + (error as Error).message);
      setTxDetails(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get explorer URL based on network ID
  const getExplorerUrl = (hash: string) => {
    if (!networkId) return null;
    
    switch (networkId) {
      case 1: // Mainnet
        return `https://etherscan.io/tx/${hash}`;
      case 5: // Goerli
        return `https://goerli.etherscan.io/tx/${hash}`;
      case 11155111: // Sepolia
        return `https://sepolia.etherscan.io/tx/${hash}`;
      case 1337: // Ganache
      case 5777: // Truffle Develop
        return null;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Explorer</CardTitle>
        <CardDescription>Look up transaction details by hash</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter transaction hash"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
          />
          <Button onClick={fetchTransaction} disabled={isLoading || !txHash}>
            {isLoading ? "Loading..." : "Lookup"}
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-4 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {txDetails && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Transaction Details</h3>
              {getExplorerUrl(txDetails.hash) && (
                <Button variant="outline" size="sm" asChild>
                  <a href={getExplorerUrl(txDetails.hash)} target="_blank" rel="noreferrer" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Explorer
                  </a>
                </Button>
              )}
            </div>
            
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Hash</TableCell>
                  <TableCell className="font-mono break-all">{txDetails.hash}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell>
                    {txDetails.status === "Success" ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        Success
                      </div>
                    ) : txDetails.status === "Failed" ? (
                      <div className="flex items-center text-red-600">
                        <X className="h-4 w-4 mr-1" />
                        Failed
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Pending
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Block</TableCell>
                  <TableCell>{txDetails.blockNumber?.toString() || "Pending"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">From</TableCell>
                  <TableCell className="font-mono">{txDetails.from}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">To</TableCell>
                  <TableCell className="font-mono">{txDetails.to || "Contract Creation"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Value</TableCell>
                  <TableCell>{txDetails.value} ETH</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Gas Price</TableCell>
                  <TableCell>{txDetails.gasPrice} Gwei</TableCell>
                </TableRow>
                {txDetails.gasUsed && (
                  <TableRow>
                    <TableCell className="font-medium">Gas Used</TableCell>
                    <TableCell>{txDetails.gasUsed.toString()}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
