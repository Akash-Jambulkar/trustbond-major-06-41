
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { DOCUMENT_TYPES, DocumentType, validateDocument, createDocumentHash } from "@/utils/documentHash";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { KYC_SUBMISSION_FEE } from "@/utils/contracts/contractConfig";

type FormValues = {
  documentType: DocumentType;
  documentNumber: string;
};

export function KYCSubmission() {
  const { submitKYC, isConnected, account, web3 } = useBlockchain();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form instance
  const form = useForm<FormValues>({
    defaultValues: {
      documentType: DOCUMENT_TYPES.PAN,
      documentNumber: "",
    }
  });

  const handleSubmit = async (values: FormValues) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!user) {
      toast.error("Please log in to submit KYC");
      return;
    }

    if (!validateDocument(values.documentType, values.documentNumber)) {
      toast.error(`Invalid ${values.documentType} number format`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate the document hash using document type and number
      const documentHash = await createDocumentHash(values.documentType, values.documentNumber);
      
      // Calculate fee in wei
      const feeInWei = web3?.utils.toWei(KYC_SUBMISSION_FEE, 'ether') || "10000000000000000"; // 0.01 ETH
      
      // Submit to blockchain with fee
      const success = await submitKYC(documentHash, feeInWei);
      
      // Check for success properly
      if (success) {
        toast.success("Document information submitted successfully for verification!");
        form.reset();
      } else {
        toast.error("Failed to submit document information");
      }
    } catch (error) {
      console.error("Error submitting document:", error);
      toast.error("An error occurred while submitting your document information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-trustbond-primary" />
          KYC Document Verification
        </CardTitle>
        <CardDescription>
          Submit your identification document information for verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Fee</AlertTitle>
          <AlertDescription>
            A fee of {KYC_SUBMISSION_FEE} ETH is required for document verification. This helps maintain security and prevent spam.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={DOCUMENT_TYPES.PAN}>PAN Card</SelectItem>
                      <SelectItem value={DOCUMENT_TYPES.AADHAAR}>Aadhaar Card</SelectItem>
                      <SelectItem value={DOCUMENT_TYPES.VOTER_ID}>Voter ID</SelectItem>
                      <SelectItem value={DOCUMENT_TYPES.DRIVING_LICENSE}>Driving License</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of identity document you want to verify.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Number</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder={`Enter your document number`}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the identification number exactly as it appears on your document.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={!isConnected || isSubmitting || !user}
              className="w-full mt-4"
            >
              {isSubmitting ? "Submitting..." : `Submit for Verification (${KYC_SUBMISSION_FEE} ETH)`}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Once submitted, your document will be verified by authorized banks or administrators. 
        You can check the status of your verification in the KYC section.
      </CardFooter>
    </Card>
  );
}
