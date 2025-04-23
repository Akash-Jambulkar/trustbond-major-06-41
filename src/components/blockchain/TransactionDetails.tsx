
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ExternalLink, Copy, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TransactionDetailsProps {
  transaction: {
    hash: string;
    type: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: string;
    description: string;
    extraData?: {
      documentHash?: string;
      documentType?: string;
      fee?: string;
      loanId?: string;
      amount?: string;
      [key: string]: any;
    };
  };
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add toast notification here
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-orange-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{transaction.description}</CardTitle>
          <Badge variant="outline" className={getStatusColor(transaction.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(transaction.status)} 
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </Badge>
        </div>
        <CardDescription>{formatDate(transaction.timestamp)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Transaction Hash</h3>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-gray-100 p-1 px-2 rounded font-mono">
              {transaction.hash}
            </code>
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(transaction.hash)} title="Copy to clipboard">
              <Copy className="h-4 w-4" />
            </Button>
            <a 
              href={`https://etherscan.io/tx/${transaction.hash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              title="View on Etherscan"
            >
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
        
        {transaction.type === 'kyc' && transaction.extraData?.documentHash && (
          <div>
            <h3 className="text-sm font-medium mb-2">Document Hash</h3>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-gray-100 p-1 px-2 rounded font-mono overflow-x-auto max-w-full">
                {transaction.extraData.documentHash}
              </code>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(transaction.extraData?.documentHash!)} title="Copy to clipboard">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {transaction.extraData && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {transaction.extraData.documentType && (
              <div>
                <span className="text-muted-foreground">Document Type:</span>
                <p>{transaction.extraData.documentType}</p>
              </div>
            )}
            {transaction.extraData.fee && (
              <div>
                <span className="text-muted-foreground">Fee:</span>
                <p>{transaction.extraData.fee} ETH</p>
              </div>
            )}
            {transaction.extraData.loanId && (
              <div>
                <span className="text-muted-foreground">Loan ID:</span>
                <p>{transaction.extraData.loanId}</p>
              </div>
            )}
            {transaction.extraData.amount && (
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <p>{transaction.extraData.amount} ETH</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
