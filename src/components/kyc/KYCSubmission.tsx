import { useState, useEffect, useCallback } from "react";
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
import { Shield, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { DOCUMENT_TYPES, DocumentType, validateDocument, createDocumentHash } from "@/utils/documentHash";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { KYC_SUBMISSION_FEE } from "@/utils/contracts/contractConfig";
import { saveKycSubmission } from "@/utils/supabase/kycSubmissions";
import { supabase } from "@/integrations/supabase/client";
import { trackTransaction } from "@/utils/transactionTracker";

type FormValues = {
  documentType: DocumentType;
  documentNumber: string;
};

export function KYCSubmission() {
  const { submitKYC, isConnected, account, web3 } = useBlockchain();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBlockchainWarning, setShowBlockchainWarning] = useState(false);
  const [walletPrompted, setWalletPrompted] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      documentType: DOCUMENT_TYPES.PAN,
      documentNumber: "",
    }
  });

  useEffect(() => {
    if (isConnected) {
      setWalletPrompted(true);
    }
  }, [isConnected]);

  const handleSubmit = async (values: FormValues) => {
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
      const documentHash = await createDocumentHash(values.documentType, values.documentNumber);
      
      let blockchainSubmitted = false;
      let transactionHash = "";
      
      if (isConnected && web3 && account) {
        try {
          console.log("Attempting blockchain KYC submission");
          
          // Get network ID before submission attempt
          const networkId = await web3.eth.getChainId();
          console.log("Current network ID:", networkId);
          
          // Convert KYC submission fee to Wei
          const feeInWei = web3.utils.toWei(KYC_SUBMISSION_FEE, 'ether');
          console.log(`Using fee: ${KYC_SUBMISSION_FEE} ETH (${feeInWei} Wei)`);
          
          // Fix: Handle the submitKYC return type correctly - it now returns boolean, not an object
          const result = await submitKYC(documentHash, feeInWei);
          blockchainSubmitted = result;
          
          // Since result is now a boolean, we need to get transactionHash differently
          if (result) {
            // Try to get transaction hash from recent transactions
            console.log("Blockchain submission successful, checking recent transactions");
            const { data: txData } = await supabase
              .from('transactions')
              .select('transaction_hash')
              .eq('type', 'kyc')
              .eq('from_address', account.toLowerCase())
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
              
            if (txData && txData.transaction_hash) {
              transactionHash = txData.transaction_hash;
              console.log("Found transaction hash from recent submissions:", transactionHash);
            } else {
              console.log("Transaction found in blockchain but hash not recorded");
            }
          } else {
            console.log("Blockchain submission failed");
          }
          
          // Create a transaction record regardless of submission result
          if (transactionHash) {
            await trackTransaction(
              transactionHash, 
              "kyc", 
              "KYC Document Submitted", 
              account, 
              networkId,
              { 
                documentType: values.documentType,
                timestamp: new Date().toISOString(),
                documentHash,
                fee: KYC_SUBMISSION_FEE
              }
            );
            
            console.log("Transaction tracked:", transactionHash);
          }
        } catch (error) {
          console.error("Error submitting to blockchain:", error);
          setShowBlockchainWarning(true);
          blockchainSubmitted = false;
        }
      }
      
      // If blockchain submission failed or wallet not connected, use database fallback
      if (!blockchainSubmitted) {
        const submission = {
          user_id: user.id,
          document_type: values.documentType,
          document_hash: documentHash,
          verification_status: 'pending' as 'pending' | 'verified' | 'rejected',
          submitted_at: new Date().toISOString(),
          wallet_address: account || null,
        };
        
        try {
          console.log("Falling back to database submission");
          const submissionId = await saveKycSubmission(submission);
          
          if (submissionId) {
            // Create transaction record for database submission
            const dbTransactionHash = `db-kyc-${Date.now()}-${user.id.substring(0, 6)}`;
            
            // Insert the transaction directly into the database
            const { error } = await supabase.from('transactions').insert({
              transaction_hash: dbTransactionHash,
              type: 'kyc',
              from_address: account ? account.toLowerCase() : user.id,
              status: 'pending',
              user_id: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              amount: KYC_SUBMISSION_FEE, // Include fee even for database submissions
            });
            
            if (error) {
              console.error("Error creating transaction record:", error);
            } else {
              console.log("Database transaction created:", dbTransactionHash);
            }
            
            toast.success("Document information submitted successfully to our database");
            form.reset();
          } else {
            toast.error("Failed to submit document information to the database");
          }
        } catch (error) {
          console.error("Database submission error:", error);
          toast.error("Error saving to database: " + (error instanceof Error ? error.message : "Unknown error"));
        }
      } else {
        toast.success("Document information submitted successfully via blockchain");
        form.reset();
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
        {showBlockchainWarning && (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Blockchain submission unavailable</AlertTitle>
            <AlertDescription>
              We couldn't submit your document to the blockchain. Your document will be processed through our standard verification system instead.
            </AlertDescription>
          </Alert>
        )}
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Fee</AlertTitle>
          <AlertDescription>
            A fee of {KYC_SUBMISSION_FEE} ETH is required for blockchain verification. This helps maintain security and prevent spam.
            {!isConnected && " Your submission will be processed through our standard system if blockchain is unavailable."}
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
              disabled={isSubmitting || !user}
              className="w-full mt-4"
            >
              {isSubmitting ? "Submitting..." : isConnected ? `Submit for Verification (${KYC_SUBMISSION_FEE} ETH)` : "Submit for Verification"}
            </Button>
          </form>
        </Form>
        
        {!isConnected && !walletPrompted && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Info className="h-4 w-4" />
            <AlertTitle>No wallet connected</AlertTitle>
            <AlertDescription>
              You're submitting without a blockchain wallet connection. Your document will still be processed through our standard verification system.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Once submitted, your document will be verified by authorized banks or administrators. 
        You can check the status of your verification in the KYC section.
      </CardFooter>
    </Card>
  );
}
