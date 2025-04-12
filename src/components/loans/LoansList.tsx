
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LoanStatusBadge } from "./LoanStatusBadge";

interface Loan {
  id: string;
  status: number;
  amount: string;
  purpose: string;
  termDays: string;
  interestRate: string;
  appliedDate: number;
  fundingDate: number;
  repaymentDeadline: number;
  amountRepaid: string;
  lender: string;
}

interface LoanListProps {
  loans: Loan[];
  isLoading: boolean;
  formatDate: (timestamp: number) => string;
  formatAmount: (amount: string) => string;
}

export const LoansList: React.FC<LoanListProps> = ({
  loans,
  isLoading,
  formatDate,
  formatAmount
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading your loans...</p>
      </div>
    );
  }
  
  if (loans.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">
          You haven&apos;t applied for any loans yet
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {loans.map((loan, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Loan #{loan.id}</h3>
              <p className="text-sm text-gray-500">{loan.purpose}</p>
            </div>
            <LoanStatusBadge status={loan.status} />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Amount</p>
              <p className="font-medium">{formatAmount(loan.amount)}</p>
            </div>
            <div>
              <p className="text-gray-500">Term</p>
              <p className="font-medium">{loan.termDays} days</p>
            </div>
            <div>
              <p className="text-gray-500">Interest Rate</p>
              <p className="font-medium">{(Number(loan.interestRate) / 100).toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-gray-500">Applied Date</p>
              <p className="font-medium">{formatDate(loan.appliedDate)}</p>
            </div>
          </div>
          
          {Number(loan.status) >= 4 && (
            <div className="pt-2 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Lender</p>
                  <p className="font-medium font-mono">
                    {loan.lender.substring(0, 6)}...{loan.lender.substring(loan.lender.length - 4)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Funding Date</p>
                  <p className="font-medium">{formatDate(loan.fundingDate)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium">{formatDate(loan.repaymentDeadline)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Repaid</p>
                  <p className="font-medium">{formatAmount(loan.amountRepaid)}</p>
                </div>
              </div>
              
              {loan.status === 5 && (
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Make Repayment
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
