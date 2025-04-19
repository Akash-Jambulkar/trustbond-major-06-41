import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface LoanApplicationFormProps {
  isConnected: boolean;
  kyc: number;
  trustScore: number | null;
  loanContract: any;
  account: string | null;
  onLoanSubmitted: () => void;
}

export const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  isConnected,
  kyc,
  trustScore,
  loanContract,
  account,
  onLoanSubmitted
}) => {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const [loanPurpose, setLoanPurpose] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleApplyForLoan = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!loanAmount || !loanTerm || !loanPurpose) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const amountInWei = window.web3?.utils.toWei(loanAmount, "ether");
      
      await loanContract.methods
        .applyForLoan(amountInWei, loanTerm, loanPurpose)
        .send({ from: account });
      
      toast.success("Loan application submitted successfully!");
      
      setLoanAmount("");
      setLoanTerm("30");
      setLoanPurpose("");
      
      onLoanSubmitted();
    } catch (error) {
      console.error("Error applying for loan:", error);
      toast.error("Failed to submit loan application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>New Loan Application</CardTitle>
          <CardDescription>
            Fill out the form below to apply for a new loan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter loan amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              disabled={isSubmitting || !isConnected || !kyc}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="term">Loan Term (Years)</Label>
            <Select 
              value={loanTerm} 
              onValueChange={setLoanTerm}
              disabled={isSubmitting || !isConnected || !kyc}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select loan term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1"> Short Term Loan (Within 1 year)</SelectItem>
                <SelectItem value="1-5 Years"> Intermediate-term Loans </SelectItem>
                <SelectItem value="More Than 5 years">More Than 5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Loan Purpose</Label>
            <Textarea
              id="purpose"
              placeholder="Describe the purpose of your loan"
              value={loanPurpose}
              onChange={(e) => setLoanPurpose(e.target.value)}
              disabled={isSubmitting || !isConnected || !kyc}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleApplyForLoan}
            disabled={isSubmitting || !isConnected || !kyc || !loanAmount || !loanPurpose}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Apply for Loan"}
          </Button>
        </CardFooter>
      </Card>
      
      {!kyc && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              KYC Verification Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p>You need to complete KYC verification before you can apply for loans. Please go to the KYC section to complete your verification.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Go to KYC Verification
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {trustScore !== null && Number(trustScore) < 50 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Trust Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p>Your trust score is too low to apply for loans. You need a minimum score of 50. Consider building your trust score by completing more KYC verifications or transacting on the platform.</p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
