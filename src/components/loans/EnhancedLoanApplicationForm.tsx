
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoanApplicationFormProps } from "./types/loanTypes";
import { useLoanCalculations } from "./hooks/useLoanCalculations";
import { LoanSummaryDisplay } from "./LoanSummaryDisplay";
import { EligibilityDisplay } from "./EligibilityDisplay";

const loanPurposes = [
  { value: "personal", label: "Personal Loan" },
  { value: "business", label: "Business Loan" },
  { value: "education", label: "Education Loan" },
  { value: "home", label: "Home Improvement" },
  { value: "debt", label: "Debt Consolidation" },
  { value: "medical", label: "Medical Expenses" },
  { value: "other", label: "Other" }
];

export const EnhancedLoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  isConnected,
  kyc,
  trustScore,
  loanContract,
  account,
  onLoanSubmitted
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(0.1);
  const [loanDuration, setLoanDuration] = useState<number>(3);
  const [purpose, setPurpose] = useState<string>("personal");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    maxLoanAmount,
    eligibility,
    formErrors,
    validateForm,
    getLoanSummary
  } = useLoanCalculations(
    trustScore,
    kyc,
    loanAmount,
    loanDuration,
    isConnected,
    purpose
  );

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
      
      const amountInWei = window.web3?.utils.toWei(loanAmount.toString(), "ether");
      
      const tx = await loanContract.methods.requestLoan(
        amountInWei,
        loanDuration * 30,
        purpose
      ).send({ from: account });
      
      toast.success("Loan application submitted successfully");
      onLoanSubmitted();
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast.error("Failed to submit loan application: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <Label htmlFor="eligibility" className="text-base font-semibold">
            Loan Eligibility
          </Label>
          
          <EligibilityDisplay 
            eligible={eligibility.eligible}
            reason={eligibility.reason}
            kyc={kyc}
          />
          
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

              <LoanSummaryDisplay summary={getLoanSummary()} />
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !eligibility.eligible || !isConnected || kyc !== 1}
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
