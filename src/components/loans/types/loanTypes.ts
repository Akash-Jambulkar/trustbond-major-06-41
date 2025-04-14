
export interface LoanApplicationFormProps {
  isConnected: boolean;
  kyc: number;
  trustScore: number | null;
  loanContract: any;
  account: string | null;
  onLoanSubmitted: () => void;
}

export interface LoanFormData {
  loanAmount: number;
  loanDuration: number;
  purpose: string;
}

export interface LoanSummary {
  apr: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
}

export interface FormErrors {
  [key: string]: string;
}
