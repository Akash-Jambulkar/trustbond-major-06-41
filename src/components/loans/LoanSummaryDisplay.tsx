
import React from 'react';
import { LoanSummary } from './types/loanTypes';

interface LoanSummaryDisplayProps {
  summary: LoanSummary;
}

export const LoanSummaryDisplay: React.FC<LoanSummaryDisplayProps> = ({ summary }) => {
  return (
    <div className="space-y-4 pt-4 rounded-md bg-slate-50 p-4">
      <h3 className="font-medium">Loan Summary</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">Annual Interest Rate</p>
          <p className="font-medium">{summary.apr.toFixed(2)}%</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Monthly Payment</p>
          <p className="font-medium">{summary.monthlyPayment.toFixed(4)} ETH</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Total Repayment</p>
          <p className="font-medium">{summary.totalRepayment.toFixed(4)} ETH</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Total Interest</p>
          <p className="font-medium">{summary.totalInterest.toFixed(4)} ETH</p>
        </div>
      </div>
    </div>
  );
};
