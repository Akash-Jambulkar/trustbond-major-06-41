
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useToast } from "@/components/ui/use-toast";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, CheckCircle, CreditCard, Info } from "lucide-react";

// Validation schema for loan application
const formSchema = z.object({
  loanAmount: z.string().min(1, "Loan amount is required").refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Loan amount must be a positive number",
  }),
  loanPurpose: z.string().min(3, "Loan purpose must be at least 3 characters"),
  loanTerm: z.string().min(1, "Loan term is required"),
  collateral: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const LoanApplicationPage = () => {
  const { isConnected, kycStatus = "not_verified" } = useBlockchain();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: "",
      loanPurpose: "",
      loanTerm: "",
      collateral: "",
      additionalInfo: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to apply for a loan.",
      });
      return;
    }

    if (kycStatus !== "verified") {
      toast({
        variant: "destructive",
        title: "KYC not verified",
        description: "Your KYC must be verified before applying for a loan.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call the blockchain to create a loan request
      // For demonstration purposes, we'll just show a success toast
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Loan application submitted",
        description: "Your loan application has been submitted successfully. You can track its status in the Loans section.",
      });
      
      // Redirect to loans page
      navigate("/dashboard/user/loans");
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast({
        variant: "destructive",
        title: "Error submitting application",
        description: "There was an error submitting your loan application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Apply for a Loan</h1>
        <p className="text-muted-foreground">
          Complete the form below to apply for a blockchain-backed loan.
        </p>
      </div>
      
      {!isConnected && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Wallet Not Connected</AlertTitle>
          <AlertDescription className="text-amber-700">
            Please connect your wallet to apply for a loan. Loan applications require blockchain transactions.
          </AlertDescription>
        </Alert>
      )}
      
      {kycStatus !== "verified" && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">KYC Not Verified</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your KYC must be verified before you can apply for a loan. Please complete KYC verification first.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-trustbond-primary" />
            Loan Application
          </CardTitle>
          <CardDescription>
            Fill out the details for your loan request. All applications are processed securely on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount (ETH)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 5.0" 
                        type="number" 
                        step="0.01" 
                        min="0.01" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the amount you wish to borrow in ETH.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="loanPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Purpose</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal Expenses</SelectItem>
                          <SelectItem value="business">Business Expansion</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="medical">Medical Expenses</SelectItem>
                          <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                          <SelectItem value="home_improvement">Home Improvement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the primary purpose of this loan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="loanTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Term</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 Days</SelectItem>
                          <SelectItem value="90">90 Days</SelectItem>
                          <SelectItem value="180">180 Days</SelectItem>
                          <SelectItem value="365">1 Year</SelectItem>
                          <SelectItem value="730">2 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the duration of the loan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="collateral"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collateral (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Collateral description or token address" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      If applicable, describe the collateral you're offering for this loan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional details that might support your application" 
                        {...field} 
                        className="h-24"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide any additional context that might help with your loan application.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between bg-muted/50">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/user")}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting || !isConnected || kycStatus !== "verified"}
            className="bg-trustbond-primary hover:bg-trustbond-primary/90"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Loan Application Process
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ol className="space-y-4 list-decimal ml-4">
            <li>Submit your loan application</li>
            <li>Banks review your application and trust score</li>
            <li>Loan terms are created as smart contracts</li>
            <li>You accept the terms to receive funds</li>
            <li>Repayments are made according to the schedule</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanApplicationPage;
