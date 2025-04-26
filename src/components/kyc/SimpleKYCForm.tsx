
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDocumentHash, validateDocument, DOCUMENT_TYPES } from "@/utils/documentHash";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FormValues = {
  documentType: string;
  documentNumber: string;
  fullName: string;
  address: string;
  phoneNumber: string;
};

export function SimpleKYCForm() {
  const { submitKYC, isConnected } = useBlockchain();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      documentType: "AADHAAR",
      documentNumber: "",
      fullName: "",
      address: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("Please log in to submit KYC");
      return;
    }

    // Convert string to enum type for validation and hash creation
    const docType = values.documentType as keyof typeof DOCUMENT_TYPES;
    
    if (!validateDocument(DOCUMENT_TYPES[docType], values.documentNumber)) {
      toast.error(`Invalid ${values.documentType} number format`);
      return;
    }

    setIsSubmitting(true);
    try {
      const documentHash = await createDocumentHash(DOCUMENT_TYPES[docType], values.documentNumber);
      console.log("Generated document hash:", documentHash);
      console.log("Current user ID:", user.id);
      console.log("Document type:", values.documentType);
      
      // Update profile with additional information
      console.log("Updating profile information...");
      const profileUpdateResult = await supabase
        .from('profiles')
        .update({
          name: values.fullName,
          phone: values.phoneNumber,
          address: values.address,
          kyc_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileUpdateResult.error) {
        console.error("Error updating profile:", profileUpdateResult.error);
        toast.error("Failed to update profile information");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Profile successfully updated");

      // Prepare KYC document submission data
      const kycSubmissionData = {
        user_id: user.id,
        document_type: values.documentType,
        document_hash: documentHash,
        verification_status: 'pending',
        submitted_at: new Date().toISOString(),
        wallet_address: isConnected && window.ethereum?.selectedAddress ? window.ethereum.selectedAddress : null
      };
      
      console.log("Submitting KYC data:", kycSubmissionData);

      // Submit KYC document to the database
      console.log("Calling supabase.from('kyc_document_submissions').insert()");
      const kycSubmissionResult = await supabase
        .from('kyc_document_submissions')
        .insert([kycSubmissionData]);

      if (kycSubmissionResult.error) {
        console.error("Error submitting KYC:", kycSubmissionResult.error);
        console.error("Error details:", kycSubmissionResult.error.details);
        console.error("Error message:", kycSubmissionResult.error.message);
        toast.error("Failed to submit KYC document to database");
        setIsSubmitting(false);
        return;
      }
      
      console.log("KYC submission successful to database", kycSubmissionResult);

      // If connected to blockchain, submit there as well
      if (isConnected && submitKYC) {
        try {
          console.log("Submitting to blockchain...");
          // Passing both required arguments - documentHash and an empty string for the second parameter
          await submitKYC(documentHash, "");
          console.log("Blockchain submission successful");
        } catch (error) {
          console.error("Blockchain submission failed:", error);
          toast.error("Blockchain submission failed, but database submission was successful");
        }
      }

      toast.success("KYC submission successful! Awaiting verification from banks.");
      form.reset();
    } catch (error) {
      console.error("Error in KYC submission:", error);
      toast.error("Failed to submit KYC");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          KYC Verification
        </CardTitle>
        <CardDescription>
          Submit your identification details for verification by our partner banks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AADHAAR">Aadhaar Card</SelectItem>
                      <SelectItem value="PAN">PAN Card</SelectItem>
                      <SelectItem value="VOTER_ID">Voter ID</SelectItem>
                      <SelectItem value="DRIVING_LICENSE">Driving License</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose your primary identification document
                  </FormDescription>
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
                    <Input {...field} placeholder="Enter your document number" />
                  </FormControl>
                  <FormDescription>
                    Enter the number exactly as it appears on your document
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your full name" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Residential Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your current address" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your phone number" />
                  </FormControl>
                </FormItem>
              )}
            />

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important Notice</AlertTitle>
              <AlertDescription>
                Your document information will be securely hashed and shared with our partner banks for verification.
                No actual document numbers are stored in our system.
              </AlertDescription>
            </Alert>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit KYC Details"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
