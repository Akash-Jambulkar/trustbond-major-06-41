
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertTriangle, CircleDollarSign } from "lucide-react";
import { LoanStatusBadge, LOAN_STATUS } from "./LoanStatusBadge";

interface LoanDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  loan: any;
  userTrustScores: {[key: string]: number};
  userKYCStatus: {[key: string]: boolean};
  isProcessing: boolean;
  onReviewLoan: (loanId: string, approve: boolean) => void;
  onFundLoan: (loanId: string, amount: string) => void;
  onMarkDefaulted: (loanId: string) => void;
  formatDate: (timestamp: string) => string;
  formatAmount: (amount: string) => string;
}

export const LoanDetailsDialog: React.FC<LoanDetailsDialogProps> = ({
  isOpen,
  setIsOpen,
  loan,
  userTrustScores,
  userKYCStatus,
  isProcessing,
  onReviewLoan,
  onFundLoan,
  onMarkDefaulted,
  formatDate,
  formatAmount
}) => {
  if (!loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Loan Application Details</DialogTitle>
          <DialogDescription>
            Review details and make decisions on this loan application
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Loan Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">ID</Label>
                      <p className="font-medium">#{loan.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Status</Label>
                      <div className="flex items-center mt-1">
                        <LoanStatusBadge status={Number(loan.status)} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Amount</Label>
                      <p className="font-medium">{formatAmount(loan.amount)}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Term</Label>
                      <p className="font-medium">{loan.termDays} days</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Interest Rate</Label>
                      <p className="font-medium">{(Number(loan.interestRate) / 100).toFixed(2)}%</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Applied Date</Label>
                      <p className="font-medium">{formatDate(loan.appliedDate)}</p>
                    </div>
                    {Number(loan.status) >= 2 && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Approval Date</Label>
                        <p className="font-medium">{formatDate(loan.approvalDate)}</p>
                      </div>
                    )}
                    {Number(loan.status) >= 4 && (
                      <>
                        <div>
                          <Label className="text-sm text-muted-foreground">Funding Date</Label>
                          <p className="font-medium">{formatDate(loan.fundingDate)}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Repayment Deadline</Label>
                          <p className="font-medium">{formatDate(loan.repaymentDeadline)}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Lender</Label>
                          <p className="font-medium font-mono text-xs">
                            {loan.lender.substring(0, 10)}...{loan.lender.substring(loan.lender.length - 8)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Repaid Amount</Label>
                          <p className="font-medium">{formatAmount(loan.amountRepaid)}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Label className="text-sm text-muted-foreground">Loan Purpose</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded text-sm">{loan.purpose}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Borrower Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Address</Label>
                      <p className="font-medium font-mono text-xs break-all">{loan.borrower}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Trust Score</Label>
                      <div className="flex justify-between items-center mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${userTrustScores[loan.borrower] || 0}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">
                          {userTrustScores[loan.borrower] || 0}/100
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">KYC Status</Label>
                      <div className="flex items-center mt-1">
                        {userKYCStatus[loan.borrower] ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600">Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-red-600">Not Verified</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  {userTrustScores[loan.borrower] ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">Credit Risk</span>
                          {Number(userTrustScores[loan.borrower]) >= 80 ? (
                            <span className="text-xs font-medium text-green-600">Low</span>
                          ) : Number(userTrustScores[loan.borrower]) >= 50 ? (
                            <span className="text-xs font-medium text-amber-600">Medium</span>
                          ) : (
                            <span className="text-xs font-medium text-red-600">High</span>
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              Number(userTrustScores[loan.borrower]) >= 80 ? 
                                'bg-green-500' : 
                                Number(userTrustScores[loan.borrower]) >= 50 ? 
                                  'bg-amber-500' : 
                                  'bg-red-500'
                            }`}
                            style={{ width: `${100 - userTrustScores[loan.borrower]}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Risk data not available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter>
            {(Number(loan.status) === 0 || Number(loan.status) === 1) && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onReviewLoan(loan.id, false)}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject Loan
                </Button>
                <Button
                  onClick={() => onReviewLoan(loan.id, true)}
                  disabled={isProcessing}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve Loan
                </Button>
              </>
            )}
            
            {Number(loan.status) === 2 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onFundLoan(loan.id, window.web3?.utils.fromWei(loan.amount, "ether") || "0")}
                  disabled={isProcessing}
                >
                  <CircleDollarSign className="h-4 w-4 mr-1" />
                  Fund Loan
                </Button>
              </>
            )}
            
            {(Number(loan.status) === 4 || Number(loan.status) === 5) && 
              Number(loan.repaymentDeadline) < (Date.now() / 1000) && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onMarkDefaulted(loan.id)}
                  disabled={isProcessing}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Mark as Defaulted
                </Button>
              </>
            )}
            
            {((Number(loan.status) === 3) || 
              (Number(loan.status) === 6) || 
              (Number(loan.status) === 7) ||
              ((Number(loan.status) === 4 || Number(loan.status) === 5) && 
              Number(loan.repaymentDeadline) >= (Date.now() / 1000))) && (
              <Button
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};