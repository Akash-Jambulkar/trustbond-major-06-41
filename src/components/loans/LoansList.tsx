
import React from "react";
import { Link } from "react-router-dom";
import { LoanStatusBadge } from "@/components/loans/LoanStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, Info, CircleDollarSign, Loader2 } from "lucide-react";

interface LoansListProps {
  loans: any[];
  isLoading: boolean;
  formatDate: (timestamp: any) => string;
  formatAmount: (amount: string) => string;
  emptyMessage?: string;
}

export const LoansList = ({
  loans,
  isLoading,
  formatDate,
  formatAmount,
  emptyMessage = "No loans found"
}: LoansListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading loans...</span>
      </div>
    );
  }

  if (!loans || loans.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
          <CircleDollarSign className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You don't have any loans in this category.
        </p>
        <Button asChild>
          <Link to="/dashboard/user/loan-application">Apply for a Loan</Link>
        </Button>
      </div>
    );
  }

  // Sort loans by creation date (newest first)
  const sortedLoans = [...loans].sort((a, b) => 
    parseInt(b.creationTime) - parseInt(a.creationTime)
  );

  return (
    <Table>
      <TableCaption>{loans.length} loan(s) found</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Loan ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedLoans.map((loan) => (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">
              <Link 
                to={`/dashboard/user/loans/${loan.id}`}
                className="text-primary hover:underline flex items-center"
              >
                Loan #{loan.id}
              </Link>
            </TableCell>
            <TableCell>{formatAmount(loan.amount)}</TableCell>
            <TableCell>{formatDate(loan.creationTime)}</TableCell>
            <TableCell>
              <LoanStatusBadge status={loan.status} />
            </TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="outline" asChild>
                <Link to={`/dashboard/user/loans/${loan.id}`}>
                  <Info className="mr-1 h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Details</span>
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
