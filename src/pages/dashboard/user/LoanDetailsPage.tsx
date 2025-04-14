
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoanStatusBadge } from '@/components/loans/LoanStatusBadge';
import { LoanRepaymentTracker } from '@/components/loans/LoanRepaymentTracker';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

const LoanDetailsPage = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const { loanContract, account } = useBlockchain();
  
  const [loan, setLoan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadLoanDetails = async () => {
    if (!loanContract || !loanId) {
      setError("Loan contract not initialized or loan ID is missing");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const loanDetails = await loanContract.methods.getLoan(loanId).call();
      
      // Check if this loan belongs to the current user
      if (loanDetails.borrower.toLowerCase() !== account?.toLowerCase()) {
        setError("You don't have permission to view this loan");
        setLoan(null);
      } else {
        setLoan(loanDetails);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching loan details:", error);
      setError("Failed to load loan details. The loan might not exist.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoanDetails();
  }, [loanContract, account, loanId]);

  const formatEth = (wei: string): string => {
    try {
      return window.web3?.utils.fromWei(wei, 'ether') || '0';
    } catch (error) {
      return '0';
    }
  };

  const formatDate = (timestamp: string): string => {
    try {
      if (!timestamp || timestamp === '0') return 'N/A';
      return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => navigate('/dashboard/user/loans')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Loans
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Loan</h2>
            <p className="text-muted-foreground text-center">{error}</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate('/dashboard/user/loans')}
            >
              Return to Loans
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard/user/loans')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Loans
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center py-8">Loan not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/dashboard/user/loans')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Loans
        </Button>
      </div>
      
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="md:w-1/2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-1">Loan #{loanId}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Created on {formatDate(loan.creationTime)}
                  </p>
                </div>
                <LoanStatusBadge status={loan.status} />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="font-medium">{formatEth(loan.amount)} ETH</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{loan.duration} days</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="font-medium">
                      {loan.purpose || 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                    <p className="font-medium">
                      {loan.interestRate ? `${loan.interestRate / 100}%` : 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {formatDate(
                      (parseInt(loan.creationTime) + parseInt(loan.duration) * 24 * 60 * 60).toString()
                    )}
                  </p>
                </div>
                
                {loan.status === '2' && (
                  <div className="flex items-center bg-green-50 text-green-800 p-3 rounded-md">
                    <p className="text-sm">
                      This loan has been fully repaid. Thank you for your timely payments!
                    </p>
                  </div>
                )}
                
                {loan.status === '3' && (
                  <div className="flex items-center bg-red-50 text-red-800 p-3 rounded-md">
                    <p className="text-sm">
                      This loan was rejected. Please check with the lending institution for more details.
                    </p>
                  </div>
                )}
                
                {loan.status === '0' && (
                  <div className="flex items-center bg-blue-50 text-blue-800 p-3 rounded-md">
                    <p className="text-sm">
                      Your loan application is under review. You will be notified once a decision is made.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Loan Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Loan Created</p>
                    <p className="text-xs text-muted-foreground">{formatDate(loan.creationTime)}</p>
                  </div>
                </div>
                
                {loan.status === '1' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Loan Approved</p>
                      <p className="text-xs text-muted-foreground">
                        {loan.approvalTime !== '0' ? formatDate(loan.approvalTime) : 'Date not recorded'}
                      </p>
                    </div>
                  </div>
                )}
                
                {loan.status === '2' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Loan Approved</p>
                      <p className="text-xs text-muted-foreground">
                        {loan.approvalTime !== '0' ? formatDate(loan.approvalTime) : 'Date not recorded'}
                      </p>
                    </div>
                  </div>
                )}
                
                {loan.status === '2' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Loan Repaid</p>
                      <p className="text-xs text-muted-foreground">
                        {loan.repaymentTime !== '0' ? formatDate(loan.repaymentTime) : 'Date not recorded'}
                      </p>
                    </div>
                  </div>
                )}
                
                {loan.status === '3' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Loan Rejected</p>
                      <p className="text-xs text-muted-foreground">
                        {loan.rejectionTime !== '0' ? formatDate(loan.rejectionTime) : 'Date not recorded'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/2">
          <LoanRepaymentTracker 
            loan={loan} 
            onRepaymentComplete={loadLoanDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsPage;
