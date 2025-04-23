
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ExternalLink, Copy, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

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
    toast.success("Copied to clipboard");
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
  
  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  const getTransactionUrl = () => {
    // TODO: Replace with real etherscan URL when deployed to mainnet or testnet
    if (transaction.hash.startsWith('0x')) {
      return `https://etherscan.io/tx/${transaction.hash}`;
    }
    return '#'; // Local transaction
  };
  
  // Function to sync transaction with database if not already synced
  const syncTransaction = async () => {
    try {
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user?.id;
      
      if (!userId) return;
      
      // Check if transaction exists in database
      const { data: existingTx } = await supabase
        .from('transactions')
        .select('id')
        .eq('transaction_hash', transaction.hash)
        .maybeSingle();
        
      if (existingTx) {
        toast.info("Transaction already synced");
        return;
      }
      
      // Sync transaction to database
      await supabase
        .from('transactions')
        .insert({
          transaction_hash: transaction.hash,
          type: transaction.type,
          status: transaction.status,
          from_address: transaction.extraData?.fromAddress,
          to_address: transaction.extraData?.toAddress,
          amount: transaction.extraData?.amount,
          user_id: userId
        });
        
      toast.success("Transaction synced to database");
    } catch (error) {
      console.error("Error syncing transaction:", error);
      toast.error("Failed to sync transaction");
    }
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
        <CardDescription className="flex items-center justify-between">
          <span>{formatDate(transaction.timestamp)}</span>
          <span className="text-muted-foreground">{formatTimeAgo(transaction.timestamp)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Transaction Hash</h3>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <code className="text-xs bg-gray-100 p-1 px-2 rounded font-mono cursor-pointer">
                  {transaction.hash}
                </code>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to copy transaction hash</p>
              </TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(transaction.hash)} title="Copy to clipboard">
              <Copy className="h-4 w-4" />
            </Button>
            <a 
              href={getTransactionUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              title="View on Etherscan"
            >
              <Button variant="ghost" size="icon" disabled={getTransactionUrl() === '#'}>
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
            {transaction.extraData.documentType && (
              <p className="text-xs text-muted-foreground mt-1">
                Document Type: {transaction.extraData.documentType}
              </p>
            )}
          </div>
        )}
        
        {transaction.type === 'loan' && (
          <div>
            <h3 className="text-sm font-medium mb-2">Loan Details</h3>
            <div className="grid grid-cols-2 gap-2">
              {transaction.extraData?.loanId && (
                <div>
                  <span className="text-muted-foreground text-xs">Loan ID:</span>
                  <p className="font-mono text-sm">{transaction.extraData.loanId}</p>
                </div>
              )}
              {transaction.extraData?.amount && (
                <div>
                  <span className="text-muted-foreground text-xs">Amount:</span>
                  <p className="font-medium">{transaction.extraData.amount} ETH</p>
                </div>
              )}
              {transaction.extraData?.interestRate && (
                <div>
                  <span className="text-muted-foreground text-xs">Interest Rate:</span>
                  <p>{transaction.extraData.interestRate}%</p>
                </div>
              )}
              {transaction.extraData?.term && (
                <div>
                  <span className="text-muted-foreground text-xs">Term:</span>
                  <p>{transaction.extraData.term} months</p>
                </div>
              )}
              {transaction.extraData?.purpose && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-xs">Purpose:</span>
                  <p>{transaction.extraData.purpose}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {transaction.type === 'verification' && (
          <div>
            <h3 className="text-sm font-medium mb-2">Verification Details</h3>
            {transaction.extraData?.verificationStatus && (
              <div>
                <Badge variant={transaction.extraData.verificationStatus === 'verified' ? 'default' : 'destructive'}>
                  {transaction.extraData.verificationStatus}
                </Badge>
              </div>
            )}
            {transaction.extraData?.notes && (
              <div className="mt-2">
                <span className="text-muted-foreground text-xs">Notes:</span>
                <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">{transaction.extraData.notes}</p>
              </div>
            )}
          </div>
        )}
        
        <Button variant="outline" size="sm" className="w-full" onClick={syncTransaction}>
          Sync Transaction to Database
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
