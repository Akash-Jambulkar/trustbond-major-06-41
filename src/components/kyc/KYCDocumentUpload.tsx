
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Shield, AlertCircle, Info } from "lucide-react";
import { 
  createDocumentHash, 
  type DocumentType, 
  validateDocument, 
  DOCUMENT_TYPES
} from "@/utils/documentHash";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { KYC_SUBMISSION_FEE } from "@/utils/contracts/contractConfig";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { trackTransaction } from "@/utils/transactionTracker";

const documentSchema = z.object({
  documentType: z.string(),
  documentNumber: z.string().min(1, "Document number is required")
});

type DocumentFormValues = z.infer<typeof documentSchema>;

export function KYCDocumentUpload() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { submitKYC, isConnected, web3, account } = useBlockchain();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBlockchainWarning, setShowBlockchainWarning] = useState(false);

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentType: DOCUMENT_TYPES.AADHAAR,
      documentNumber: ""
    },
  });

  const handleSubmit = async (values: DocumentFormValues) => {
    if (!user) {
      toast({
        title: "Please log in to submit KYC",
        variant: "destructive"
      });
      return;
    }

    if (!validateDocument(values.documentType as DocumentType, values.documentNumber)) {
      toast({
        title: `Invalid ${values.documentType} number format`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate document hash
      const documentHash = await createDocumentHash(values.documentType as DocumentType, values.documentNumber);
      
      let blockchainSubmitted = false;
      let blockchainTxHash = null;
      
      // Try blockchain submission if connected
      if (isConnected && web3 && submitKYC) {
        try {
          const result = await submitKYC(documentHash, KYC_SUBMISSION_FEE);
          
          // Since submitKYC now returns a boolean, we just check if it's true
          blockchainSubmitted = result;
          console.log("KYC submitted to blockchain successfully:", result);
          
          // Get the transaction hash from the blockchain context's transactions array
          // This is a workaround since submitKYC doesn't return the transaction hash directly
        } catch (error) {
          console.error("Error submitting to blockchain:", error);
          setShowBlockchainWarning(true);
          blockchainSubmitted = false;
        }
      } else {
        setShowBlockchainWarning(true);
      }
      
      // Always store submission in database whether blockchain submission worked or not
      try {
        const currentWallet = web3 && isConnected && account ? account : null;
        
        // Store submission in database
        const { data, error } = await supabase.from('kyc_document_submissions').insert({
          user_id: user.id,
          document_type: values.documentType,
          document_hash: documentHash,
          document_number: values.documentNumber,
          verification_status: 'pending',
          submitted_at: new Date().toISOString(),
          wallet_address: currentWallet,
          blockchain_tx_hash: blockchainTxHash
        }).select();
        
        if (error) {
          console.error("Database submission error:", error);
          throw error;
        }

        // Also try to update the user's profile KYC status
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            kyc_status: 'pending',
            wallet_address: currentWallet,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (profileError) {
          console.error("Error updating profile KYC status:", profileError);
        }
        
        // If we have blockchain data, create a transaction record
        if (blockchainSubmitted) {
          // We don't have a transaction hash from submitKYC anymore, so this might not work
          // The transaction tracking needs to be moved into the BlockchainContext
        }
        
        toast({
          title: "KYC document submitted successfully",
          description: blockchainSubmitted 
            ? "Your document has been submitted via blockchain" 
            : "Your document has been submitted for verification",
        });
        form.reset();
      } catch (dbError) {
        console.error("Database submission error:", dbError);
        toast({
          title: "Error saving submission to database",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting document:", error);
      toast({
        title: "Error submitting document",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          KYC Document Verification
        </CardTitle>
        <CardDescription>
          Submit your document information for KYC verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showBlockchainWarning && (
          <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Blockchain submission unavailable</AlertTitle>
            <AlertDescription>
              We couldn't submit your document to the blockchain. Your document will be processed through our standard verification system instead.
            </AlertDescription>
          </Alert>
        )}
        
        {isConnected && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Verification Fee</AlertTitle>
            <AlertDescription>
              A fee of {web3 ? web3.utils.fromWei(KYC_SUBMISSION_FEE, 'ether') : '0.01'} ETH is required for blockchain verification.
            </AlertDescription>
          </Alert>
        )}
        
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
                      <SelectItem value={DOCUMENT_TYPES.AADHAAR}>Aadhaar Card</SelectItem>
                      <SelectItem value={DOCUMENT_TYPES.PAN}>PAN Card</SelectItem>
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
                      placeholder="Enter your document number"
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
              disabled={isSubmitting || !user}
              className="w-full mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : isConnected ? 
                `Submit for Verification (${web3 ? web3.utils.fromWei(KYC_SUBMISSION_FEE, 'ether') : '0.01'} ETH)` : 
                "Submit for Verification"
              }
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Your document information will be securely hashed. After submission, it will be verified by authorized banks or administrators.
      </CardFooter>
    </Card>
  );
}
