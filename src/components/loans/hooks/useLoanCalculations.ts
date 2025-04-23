
import { useState, useEffect } from "react";
import CreditScoringService from "@/services/CreditScoringService";
import { useAuth } from "@/contexts/AuthContext";

interface FormErrors {
  amount: string | null;
  duration: string | null;
  purpose: string | null;
}

interface LoanSummary {
  monthlyPayment: number;
  totalRepayment: number;
  interestRate: number;
  totalInterest: number;
  firstPaymentDate: Date;
  lastPaymentDate: Date;
}

export const useLoanCalculations = (
  trustScore: number,
  kyc: number,
  loanAmount: number,
  loanDuration: number,
  isConnected: boolean,
  purpose: string
) => {
  const [maxLoanAmount, setMaxLoanAmount] = useState<number>(5);
  const [formErrors, setFormErrors] = useState<FormErrors>({ 
    amount: null, 
    duration: null, 
    purpose: null 
  });
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [eligibility, setEligibility] = useState<{ eligible: boolean; reason: string }>({
    eligible: false,
    reason: "Checking eligibility..."
  });
  
  const { user } = useAuth();

  // Calculate interest rate based on trust score and loan duration
  useEffect(() => {
    const calculateInterestRate = async () => {
      try {
        if (user?.id) {
          // Use the credit scoring service to get recommended interest rate
          const riskAssessment = await CreditScoringService.assessLoanRisk(
            user.id, 
            loanAmount
          );
          
          if (riskAssessment.status === 'success') {
            setInterestRate(riskAssessment.recommendedInterestRate);
            setMaxLoanAmount(riskAssessment.maximumAmount);
          } else {
            // Fallback to calculating based on trust score
            const baseRate = 10;
            const trustScoreDiscount = trustScore > 0 ? (trustScore / 100) * 5 : 0;
            const durationPremium = loanDuration > 12 ? (loanDuration - 12) * 0.1 : 0;
            
            const calculatedRate = Math.max(baseRate - trustScoreDiscount + durationPremium, 5);
            setInterestRate(parseFloat(calculatedRate.toFixed(2)));
            
            // Set max loan amount based on trust score
            const trustBasedMax = Math.max(0.5, trustScore > 0 ? trustScore / 10 : 1);
            setMaxLoanAmount(parseFloat(trustBasedMax.toFixed(1)));
          }
        } else {
          // Default values if user is not logged in
          setInterestRate(10);
          setMaxLoanAmount(1);
        }
      } catch (error) {
        console.error("Error calculating interest rate:", error);
        // Default fallback
        setInterestRate(10);
        setMaxLoanAmount(1);
      }
    };
    
    calculateInterestRate();
  }, [trustScore, loanDuration, loanAmount, user]);
  
  // Check loan eligibility
  useEffect(() => {
    if (!isConnected) {
      setEligibility({ 
        eligible: false, 
        reason: "Please connect your wallet to apply for a loan." 
      });
      return;
    }
    
    if (kyc !== 1) {
      setEligibility({ 
        eligible: false, 
        reason: "KYC verification required before applying for loans." 
      });
      return;
    }
    
    if (trustScore === 0) {
      setEligibility({ 
        eligible: false, 
        reason: "A trust score is required before applying for loans." 
      });
      return;
    }
    
    if (loanAmount > maxLoanAmount) {
      setEligibility({ 
        eligible: false, 
        reason: `The maximum loan amount available to you is ${maxLoanAmount} ETH.` 
      });
      return;
    }
    
    setEligibility({ 
      eligible: true, 
      reason: `You are eligible for a loan up to ${maxLoanAmount} ETH.` 
    });
  }, [isConnected, kyc, trustScore, loanAmount, maxLoanAmount]);
  
  // Validate form fields
  const validateForm = () => {
    const errors: FormErrors = {
      amount: null,
      duration: null,
      purpose: null
    };
    
    if (!loanAmount || loanAmount <= 0) {
      errors.amount = "Please enter a valid loan amount.";
    } else if (loanAmount > maxLoanAmount) {
      errors.amount = `Maximum loan amount is ${maxLoanAmount} ETH.`;
    }
    
    if (!loanDuration || loanDuration <= 0) {
      errors.duration = "Please enter a valid loan duration.";
    }
    
    if (!purpose) {
      errors.purpose = "Please select a loan purpose.";
    }
    
    setFormErrors(errors);
    
    // Return true if no errors
    return Object.values(errors).every(error => error === null);
  };
  
  // Calculate and return loan summary
  const getLoanSummary = (): LoanSummary => {
    const principal = loanAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = loanDuration;
    
    // Calculate monthly payment using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const monthlyPayment =
      (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
    
    const totalRepayment = monthlyPayment * totalPayments;
    const totalInterest = totalRepayment - principal;
    
    const now = new Date();
    const firstPaymentDate = new Date(now.setMonth(now.getMonth() + 1));
    const lastPaymentDate = new Date(now.setMonth(now.getMonth() + loanDuration - 1));
    
    return {
      monthlyPayment: parseFloat(monthlyPayment.toFixed(4)),
      totalRepayment: parseFloat(totalRepayment.toFixed(4)),
      interestRate: interestRate,
      totalInterest: parseFloat(totalInterest.toFixed(4)),
      firstPaymentDate,
      lastPaymentDate
    };
  };
  
  return {
    maxLoanAmount,
    interestRate,
    eligibility,
    formErrors,
    validateForm,
    getLoanSummary
  };
};
