
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { Transaction } from "@/utils/transactions";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionDetailsDialog = ({
  transaction: tx,
  isOpen,
  onOpenChange,
}: TransactionDetailsDialogProps) => {
  if (!tx) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Detailed information about this blockchain transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm">{tx.description}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Transaction Hash</p>
            <p className="text-sm font-mono break-all">{tx.hash}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Type</p>
              <p className="text-sm">{getTypeName(tx.type)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <div>
                <TransactionStatusBadge status={tx.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Date & Time</p>
              <p className="text-sm">{formatDate(tx.timestamp)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Network</p>
              <p className="text-sm">
                {tx.network === 1337 ? "Local Ganache" : `Chain ID: ${tx.network}`}
              </p>
            </div>
          </div>

          {tx.metadata && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Additional Data</p>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                {JSON.stringify(tx.metadata, null, 2)}
              </pre>
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                window.open(
                  `https://${
                    tx.network === 1337 ? "localhost:8545" : "etherscan.io"
                  }/tx/${tx.hash}`,
                  "_blank"
                )
              }
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on {tx.network === 1337 ? "Blockchain Explorer" : "Etherscan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
