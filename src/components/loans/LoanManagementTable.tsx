
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, CircleDollarSign, AlertTriangle, AlertCircle } from "lucide-react";
import { LoanStatusBadge, LOAN_STATUS } from "./LoanStatusBadge";

interface LoanManagementTableProps {
  loans: any[];
  isLoading: boolean;
  isProcessing: boolean;
  onViewDetails: (loan: any) => void;
  onReviewLoan: (loanId: string, approve: boolean) => void;
  onFundLoan: (loanId: string, amount: string) => void;
  onMarkDefaulted: (loanId: string) => void;
  formatDate: (timestamp: string) => string;
  formatAmount: (amount: string) => string;
}

export const LoanManagementTable: React.FC<LoanManagementTableProps> = ({
  loans,
  isLoading,
  isProcessing,
  onViewDetails,
  onReviewLoan,
  onFundLoan,
  onMarkDefaulted,
  formatDate,
  formatAmount
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading loan applications...</p>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">
          No loan applications found
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Borrower</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">#{loan.id}</TableCell>
            <TableCell className="font-mono text-xs">
              {loan.borrower.substring(0, 6)}...{loan.borrower.substring(loan.borrower.length - 4)}
            </TableCell>
            <TableCell>{formatAmount(loan.amount)}</TableCell>
            <TableCell className="max-w-[200px] truncate">{loan.purpose}</TableCell>
            <TableCell>
              <LoanStatusBadge status={Number(loan.status)} showIcon={false} showBadge={true} />
            </TableCell>
            <TableCell>{formatDate(loan.appliedDate)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onViewDetails(loan)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
                
                {(Number(loan.status) === 0 || Number(loan.status) === 1) && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                      onClick={() => onReviewLoan(loan.id, true)}
                      disabled={isProcessing}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                      onClick={() => onReviewLoan(loan.id, false)}
                      disabled={isProcessing}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                
                {Number(loan.status) === 2 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
                    onClick={() => onFundLoan(loan.id, window.web3.utils.fromWei(loan.amount, "ether"))}
                    disabled={isProcessing}
                  >
                    <CircleDollarSign className="h-4 w-4 mr-1" />
                    Fund
                  </Button>
                )}
                
                {(Number(loan.status) === 4 || Number(loan.status) === 5) && 
                 Number(loan.repaymentDeadline) < (Date.now() / 1000) && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border-amber-200"
                    onClick={() => onMarkDefaulted(loan.id)}
                    disabled={isProcessing}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Mark Defaulted
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
