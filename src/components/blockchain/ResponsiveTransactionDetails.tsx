
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ExternalLink, Copy, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ResponsiveTransactionDetailsProps {
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

export const ResponsiveTransactionDetails: React.FC<ResponsiveTransactionDetailsProps> = ({ transaction }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
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
      
      // Convert amount to a number if it exists
      const amount = transaction.extraData?.amount ? 
        parseFloat(transaction.extraData.amount) : 
        null;
      
      // Sync transaction to database
      await supabase
        .from('transactions')
        .insert({
          transaction_hash: transaction.hash,
          type: transaction.type,
          status: transaction.status,
          from_address: transaction.extraData?.fromAddress,
          to_address: transaction.extraData?.toAddress,
          amount: amount, // Ensure this is a number
          user_id: userId
        });
        
      toast.success("Transaction synced to database");
    } catch (error) {
      console.error("Error syncing transaction:", error);
      toast.error("Failed to sync transaction");
    }
  };

  const formatHashForDisplay = (hash: string) => {
    return window.innerWidth < 640 && hash.length > 16 ? 
      `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}` : 
      hash;
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-base line-clamp-1">{transaction.description}</CardTitle>
          <Badge variant="outline" className={getStatusColor(transaction.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(transaction.status)} 
              <span className="hidden sm:inline">{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
            </span>
          </Badge>
        </div>
        <CardDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs">
          <span>{formatDate(transaction.timestamp)}</span>
          <span className="text-muted-foreground">{formatTimeAgo(transaction.timestamp)}</span>
        </CardDescription>
      </CardHeader>
      
      <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center justify-center w-full border-t hover:bg-gray-50">
            {isDetailsOpen ? (
              <span className="flex items-center gap-1 text-xs font-medium">Hide details <ChevronUp className="h-3 w-3" /></span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium">View details <ChevronDown className="h-3 w-3" /></span>
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-2">
            <div>
              <h3 className="text-sm font-medium mb-2">Transaction Hash</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <code className="text-xs bg-gray-100 p-1 px-2 rounded font-mono cursor-pointer max-w-full overflow-hidden text-ellipsis">
                      {formatHashForDisplay(transaction.hash)}
                    </code>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to copy transaction hash</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(transaction.hash)} title="Copy to clipboard" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <a 
                    href={getTransactionUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="View on Etherscan"
                    className="inline-block"
                  >
                    <Button variant="ghost" size="icon" disabled={getTransactionUrl() === '#'} className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            
            {transaction.type === 'kyc' && transaction.extraData?.documentHash && (
              <div className="text-xs">
                <h3 className="font-medium mb-1">Document Hash</h3>
                <div className="flex flex-wrap items-center gap-1">
                  <code className="bg-gray-100 p-1 px-2 rounded font-mono overflow-hidden text-ellipsis max-w-[200px] sm:max-w-full">
                    {formatHashForDisplay(transaction.extraData.documentHash)}
                  </code>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(transaction.extraData?.documentHash!)} title="Copy to clipboard" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {transaction.extraData.documentType && (
                  <p className="text-muted-foreground mt-1">
                    Document Type: {transaction.extraData.documentType}
                  </p>
                )}
              </div>
            )}
            
            {transaction.type === 'loan' && (
              <div className="text-xs">
                <h3 className="font-medium mb-1">Loan Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {transaction.extraData?.loanId && (
                    <div>
                      <span className="text-muted-foreground">Loan ID:</span>
                      <p className="font-mono truncate">{formatHashForDisplay(transaction.extraData.loanId)}</p>
                    </div>
                  )}
                  {transaction.extraData?.amount && (
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className="font-medium">{transaction.extraData.amount} ETH</p>
                    </div>
                  )}
                  {transaction.extraData?.interestRate && (
                    <div>
                      <span className="text-muted-foreground">Interest Rate:</span>
                      <p>{transaction.extraData.interestRate}%</p>
                    </div>
                  )}
                  {transaction.extraData?.term && (
                    <div>
                      <span className="text-muted-foreground">Term:</span>
                      <p>{transaction.extraData.term} months</p>
                    </div>
                  )}
                  {transaction.extraData?.purpose && (
                    <div className="col-span-1 sm:col-span-2">
                      <span className="text-muted-foreground">Purpose:</span>
                      <p>{transaction.extraData.purpose}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {transaction.type === 'verification' && (
              <div className="text-xs">
                <h3 className="font-medium mb-1">Verification Details</h3>
                {transaction.extraData?.verificationStatus && (
                  <div>
                    <Badge variant={transaction.extraData.verificationStatus === 'verified' ? 'default' : 'destructive'} className="text-xs">
                      {transaction.extraData.verificationStatus}
                    </Badge>
                  </div>
                )}
                {transaction.extraData?.notes && (
                  <div className="mt-2">
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">{transaction.extraData.notes}</p>
                  </div>
                )}
              </div>
            )}
            
            <Button variant="outline" size="sm" className="w-full text-xs mt-2" onClick={syncTransaction}>
              Sync Transaction to Database
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ResponsiveTransactionDetails;
