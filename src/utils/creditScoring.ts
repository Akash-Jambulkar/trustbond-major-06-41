
/**
 * Credit scoring utility to calculate loan eligibility and interest rates
 * based on user's trust score and KYC verification status
 */

import { useBlockchain } from "@/contexts/BlockchainContext";

// Credit score tiers and corresponding interest rates
export const CREDIT_TIERS = {
  EXCELLENT: { min: 90, rate: 4.5 },
  VERY_GOOD: { min: 80, rate: 6.5 },
  GOOD: { min: 70, rate: 8.5 },
  FAIR: { min: 60, rate: 10.5 },
  POOR: { min: 50, rate: 12.5 },
  VERY_POOR: { min: 0, rate: 15.0 }
};

/**
 * Calculate annual percentage rate based on trust score
 * @param trustScore User's trust score (0-100)
 * @returns Interest rate percentage
 */
export const calculateAPR = (trustScore: number): number => {
  if (trustScore >= CREDIT_TIERS.EXCELLENT.min) return CREDIT_TIERS.EXCELLENT.rate;
  if (trustScore >= CREDIT_TIERS.VERY_GOOD.min) return CREDIT_TIERS.VERY_GOOD.rate;
  if (trustScore >= CREDIT_TIERS.GOOD.min) return CREDIT_TIERS.GOOD.rate;
  if (trustScore >= CREDIT_TIERS.FAIR.min) return CREDIT_TIERS.FAIR.rate;
  if (trustScore >= CREDIT_TIERS.POOR.min) return CREDIT_TIERS.POOR.rate;
  return CREDIT_TIERS.VERY_POOR.rate;
};

/**
 * Calculate maximum loan amount based on trust score and KYC status
 * @param trustScore User's trust score (0-100)
 * @param kycVerified Whether user is KYC verified
 * @returns Maximum loan amount in ETH
 */
export const calculateMaxLoanAmount = (trustScore: number, kycVerified: boolean): number => {
  if (!kycVerified) return 0.1; // Very limited if not KYC verified
  
  // Base amount determined by trust score
  const baseAmount = (trustScore / 10) * 0.5;
  
  // Cap maximum amount
  return Math.min(baseAmount, 10);
};

/**
 * Calculate repayment installment amount
 * @param principal Loan amount in ETH
 * @param apr Annual percentage rate
 * @param durationMonths Loan duration in months
 * @returns Monthly installment amount in ETH
 */
export const calculateMonthlyPayment = (
  principal: number,
  apr: number,
  durationMonths: number
): number => {
  const monthlyRate = apr / 100 / 12;
  
  // For zero interest edge case
  if (monthlyRate === 0) return principal / durationMonths;
  
  // Standard amortization formula
  const payment = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1);
    
  return parseFloat(payment.toFixed(4));
};

/**
 * Check if user is eligible for a loan
 * @param trustScore User's trust score (0-100)
 * @param kycVerified Whether user is KYC verified
 * @returns Eligibility status and reason if ineligible
 */
export const checkLoanEligibility = (
  trustScore: number,
  kycVerified: boolean
): { eligible: boolean; reason?: string } => {
  if (!kycVerified) {
    return { 
      eligible: false, 
      reason: "KYC verification required before applying for a loan" 
    };
  }
  
  if (trustScore < 30) {
    return { 
      eligible: false, 
      reason: "Trust score too low. Build your reputation to qualify for loans." 
    };
  }
  
  return { eligible: true };
};
