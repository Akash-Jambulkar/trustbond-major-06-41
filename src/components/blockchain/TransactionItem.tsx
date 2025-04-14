
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye } from "lucide-react";
import { Transaction } from "@/utils/transactions";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

interface TransactionItemProps {
  transaction: Transaction;
  onViewDetails: (tx: Transaction) => void;
}

export const TransactionItem = ({ transaction: tx, onViewDetails }: TransactionItemProps) => {
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
    <div className="border rounded-lg p-3">
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
          <TransactionStatusBadge status={tx.status} />
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {getTypeName(tx.type)}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => onViewDetails(tx)}
              title="View transaction details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
