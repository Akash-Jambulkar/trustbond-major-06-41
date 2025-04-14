
import React, { useState } from 'react';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface LoanRepaymentTrackerProps {
  loan: any;
  onRepaymentComplete: () => void;
}

export function LoanRepaymentTracker({ loan, onRepaymentComplete }: LoanRepaymentTrackerProps) {
  const { repayLoan, account } = useBlockchain();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!loan) return null;

  // Format values
  const formatEth = (wei: string): string => {
    try {
      return window.web3?.utils.fromWei(wei, 'ether') || '0';
    } catch (error) {
      return '0';
    }
  };

  const totalAmount = formatEth(loan.amount || '0');
  const repaidAmount = formatEth(loan.repaidAmount || '0');
  const remainingAmount = parseFloat(totalAmount) - parseFloat(repaidAmount);
  const progress = (parseFloat(repaidAmount) / parseFloat(totalAmount)) * 100 || 0;

  const isFullyRepaid = parseFloat(repaidAmount) >= parseFloat(totalAmount);
  const isApproved = loan.status === '1'; // Assuming 1 is the approved status

  const handleRepayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      setError('Please enter a valid repayment amount');
      return;
    }

    if (parseFloat(repaymentAmount) > remainingAmount) {
      setError(`Amount exceeds the remaining balance of ${remainingAmount.toFixed(4)} ETH`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert ETH to Wei for the contract
      const amountInWei = window.web3?.utils.toWei(repaymentAmount, 'ether');
      
      await repayLoan(loan.id, amountInWei);
      
      toast.success('Loan repayment successful');
      setRepaymentAmount('');
      onRepaymentComplete();
    } catch (error) {
      console.error('Error making loan repayment:', error);
      toast.error(`Repayment failed: ${(error as Error).message}`);
      setError(`Repayment failed: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDueDate = (): string => {
    // Convert timestamp to milliseconds and add loan duration
    const creationDate = new Date(parseInt(loan.creationTime) * 1000);
    const durationDays = parseInt(loan.duration);
    const dueDate = new Date(creationDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    
    return dueDate.toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Loan Repayment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Repayment Progress</span>
            <span className="font-medium">{Math.min(progress, 100).toFixed(0)}%</span>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Loan</p>
            <p className="font-medium">{parseFloat(totalAmount).toFixed(4)} ETH</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Repaid</p>
            <p className="font-medium">{parseFloat(repaidAmount).toFixed(4)} ETH</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="font-medium">{remainingAmount.toFixed(4)} ETH</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="font-medium">{calculateDueDate()}</p>
          </div>
        </div>

        {isFullyRepaid ? (
          <div className="flex items-center bg-green-50 text-green-800 p-4 rounded-md">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Loan fully repaid!</span>
          </div>
        ) : !isApproved ? (
          <div className="flex items-center bg-amber-50 text-amber-800 p-4 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>This loan is pending approval and cannot be repaid yet.</span>
          </div>
        ) : (
          <form onSubmit={handleRepayment} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="repaymentAmount" className="text-sm font-medium">
                Repayment Amount (ETH)
              </label>
              <div className="flex space-x-2">
                <Input
                  id="repaymentAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  step="0.001"
                  min="0.001"
                  max={remainingAmount}
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setRepaymentAmount(remainingAmount.toFixed(4))}
                  disabled={isSubmitting}
                >
                  Max
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting || !repaymentAmount || parseFloat(repaymentAmount) <= 0}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Make Payment'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
