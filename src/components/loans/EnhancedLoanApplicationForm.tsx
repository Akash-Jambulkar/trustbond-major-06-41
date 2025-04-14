
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { calculateAPR, calculateMaxLoanAmount, calculateMonthlyPayment, checkLoanEligibility } from "@/utils/creditScoring";
import { Loader2 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnhancedLoanApplicationFormProps {
  isConnected: boolean;
  kyc: number;
  trustScore: number | null;
  loanContract: any;
  account: string | null;
  onLoanSubmitted: () => void;
}

export const EnhancedLoanApplicationForm = ({
  isConnected,
  kyc,
  trustScore,
  loanContract,
  account,
  onLoanSubmitted
}: EnhancedLoanApplicationFormProps) => {
  // Loan parameters
  const [loanAmount, setLoanAmount] = useState<number>(0.1);
  const [loanDuration, setLoanDuration] = useState<number>(3); // In months
  const [purpose, setPurpose] = useState<string>("personal");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Calculated loan details
  const [apr, setApr] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState<number>(0);
  const [eligibility, setEligibility] = useState<{eligible: boolean; reason?: string}>({ eligible: false });

  // Recalculate loan details when parameters change
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
      
      // Ensure loan amount doesn't exceed maximum
      if (loanAmount > maxAmount) {
        setLoanAmount(maxAmount);
      }
    }
  }, [trustScore, kyc, loanAmount, loanDuration]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!loanContract || !account) {
        throw new Error("Loan contract or account not available");
      }
      
      // Convert ETH to Wei for blockchain transaction
      const amountInWei = window.web3?.utils.toWei(loanAmount.toString(), "ether");
      
      // Submit loan request to blockchain
      const tx = await loanContract.methods.requestLoan(
        amountInWei,
        loanDuration * 30, // Convert months to days for the contract
        purpose
      ).send({ from: account });
      
      toast.success("Loan application submitted successfully");
      onLoanSubmitted(); // Notify parent component
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast.error("Failed to submit loan application: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loanPurposes = [
    { value: "personal", label: "Personal Loan" },
    { value: "business", label: "Business Loan" },
    { value: "education", label: "Education Loan" },
    { value: "home", label: "Home Improvement" },
    { value: "debt", label: "Debt Consolidation" },
    { value: "medical", label: "Medical Expenses" },
    { value: "other", label: "Other" }
  ];

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="eligibility" className="text-base font-semibold">
              Loan Eligibility
            </Label>
            <div className={`p-3 rounded-md ${eligibility.eligible ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
              {eligibility.eligible 
                ? "You are eligible to apply for a loan" 
                : eligibility.reason || "You are not currently eligible for a loan"}
            </div>
          </div>
          
          {eligibility.eligible && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="amount" className="text-base font-semibold">
                    Loan Amount (ETH)
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    Max: {maxLoanAmount} ETH
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="amount"
                    min={0.1}
                    max={maxLoanAmount}
                    step={0.1}
                    value={[loanAmount]}
                    onValueChange={(value) => setLoanAmount(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        setLoanAmount(Math.min(value, maxLoanAmount));
                      }
                    }}
                    className="w-20"
                    step={0.1}
                    min={0.1}
                    max={maxLoanAmount}
                  />
                </div>
                {formErrors.amount && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="duration" className="text-base font-semibold">
                    Loan Duration (months)
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {loanDuration} months
                  </span>
                </div>
                <Slider
                  id="duration"
                  min={1}
                  max={36}
                  step={1}
                  value={[loanDuration]}
                  onValueChange={(value) => setLoanDuration(value[0])}
                />
                {formErrors.duration && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.duration}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-base font-semibold">
                  Loan Purpose
                </Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select loan purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {loanPurposes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.purpose && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.purpose}</p>
                )}
              </div>

              <div className="space-y-4 pt-4 rounded-md bg-slate-50 p-4">
                <h3 className="font-medium">Loan Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Annual Interest Rate</p>
                    <p className="font-medium">{apr.toFixed(2)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Monthly Payment</p>
                    <p className="font-medium">{monthlyPayment.toFixed(4)} ETH</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Total Repayment</p>
                    <p className="font-medium">
                      {(monthlyPayment * loanDuration).toFixed(4)} ETH
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Total Interest</p>
                    <p className="font-medium">
                      {(monthlyPayment * loanDuration - loanAmount).toFixed(4)} ETH
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {!eligibility.eligible && kyc !== 1 && (
            <div className="rounded-md bg-blue-50 p-4 text-blue-800 border border-blue-200">
              <h3 className="font-medium">Next Steps to Qualify</h3>
              <p className="mt-1 text-sm">
                Complete your KYC verification to become eligible for loans.
              </p>
              <Button 
                variant="link" 
                className="text-blue-600 p-0 mt-2"
                onClick={() => window.location.href = '/dashboard/user/kyc'}
              >
                Go to KYC Verification
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={
              isSubmitting || 
              !eligibility.eligible || 
              !isConnected || 
              kyc !== 1
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Apply for Loan"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
