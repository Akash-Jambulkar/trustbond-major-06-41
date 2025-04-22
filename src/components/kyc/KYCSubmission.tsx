
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
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
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { DOCUMENT_TYPES, DocumentType, validateDocument, createDocumentHash } from "@/utils/documentHash";

export function KYCSubmission() {
  const { submitKYC, isConnected } = useBlockchain();
  const [documentType, setDocumentType] = useState<DocumentType>(DOCUMENT_TYPES.PAN);
  const [documentNumber, setDocumentNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form instance
  const form = useForm({
    defaultValues: {
      documentType: DOCUMENT_TYPES.PAN,
      documentNumber: "",
    }
  });

  const handleSubmit = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!validateDocument(documentType, documentNumber)) {
      toast.error(`Invalid ${documentType} number format`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate the document hash using document type and number
      const documentHash = await createDocumentHash(documentType, documentNumber);
      
      // Submit to blockchain
      const success = await submitKYC(documentHash);
      
      if (success) {
        toast.success("Document information submitted successfully for verification!");
        setDocumentNumber("");
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
        <Form {...form}>
          <div className="space-y-4">
            <div className="space-y-2">
              <FormLabel htmlFor="document-type">Document Type</FormLabel>
              <Select 
                value={documentType} 
                onValueChange={(value) => setDocumentType(value as DocumentType)}
              >
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DOCUMENT_TYPES.PAN}>PAN Card</SelectItem>
                  <SelectItem value={DOCUMENT_TYPES.AADHAAR}>Aadhaar Card</SelectItem>
                  <SelectItem value={DOCUMENT_TYPES.VOTER_ID}>Voter ID</SelectItem>
                  <SelectItem value={DOCUMENT_TYPES.DRIVING_LICENSE}>Driving License</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <FormLabel htmlFor="document-number">Document Number</FormLabel>
              <Input
                id="document-number"
                placeholder={`Enter your ${documentType} number`}
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
              {documentNumber && !validateDocument(documentType, documentNumber) && (
                <p className="text-sm text-red-500 mt-1">
                  Invalid format for {documentType}
                </p>
              )}
            </div>
          </div>
        </Form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={!isConnected || !documentNumber || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit for Verification"}
        </Button>
      </CardFooter>
    </Card>
  );
}
