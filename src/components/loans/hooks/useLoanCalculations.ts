
import { useState, useEffect } from 'react';
import { calculateAPR, calculateMaxLoanAmount, calculateMonthlyPayment, checkLoanEligibility } from '@/utils/creditScoring';
import { LoanSummary, FormErrors } from '../types/loanTypes';

export const useLoanCalculations = (
  trustScore: number | null,
  kyc: number,
  loanAmount: number,
  loanDuration: number,
  isConnected: boolean,
  purpose: string
) => {
  const [apr, setApr] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState<number>(0);
  const [eligibility, setEligibility] = useState<{eligible: boolean; reason?: string}>({ eligible: false });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (trustScore !== null) {
      const kycVerified = kyc === 1;
      const calculatedApr = calculateAPR(trustScore);
      const maxAmount = calculateMaxLoanAmount(trustScore, kycVerified);
      const payment = calculateMonthlyPayment(loanAmount, calculatedApr, loanDuration);
      const eligibilityCheck = checkLoanEligibility(trustScore, kycVerified);
      
      setApr(calculatedApr);
      setMaxLoanAmount(maxAmount);
      setMonthlyPayment(payment);
      setEligibility(eligibilityCheck);
    }
  }, [trustScore, kyc, loanAmount, loanDuration]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!isConnected) {
      errors.connection = "Please connect your wallet first";
    }
    
    if (kyc !== 1) {
      errors.kyc = "KYC verification is required for loan applications";
    }
    
    if (loanAmount <= 0) {
      errors.amount = "Loan amount must be greater than 0";
    }
    
    if (loanAmount > maxLoanAmount) {
      errors.amount = `Loan amount cannot exceed your maximum of ${maxLoanAmount} ETH`;
    }
    
    if (loanDuration < 1) {
      errors.duration = "Loan duration must be at least 1 month";
    }
    
    if (!purpose) {
      errors.purpose = "Please select a loan purpose";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getLoanSummary = (): LoanSummary => {
    const totalRepayment = monthlyPayment * loanDuration;
    return {
      apr,
      monthlyPayment,
      totalRepayment,
      totalInterest: totalRepayment - loanAmount
    };
  };

  return {
    apr,
    monthlyPayment,
    maxLoanAmount,
    eligibility,
    formErrors,
    validateForm,
    getLoanSummary
  };
};
