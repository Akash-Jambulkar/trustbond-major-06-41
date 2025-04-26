
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDocumentHash, validateDocument } from "@/utils/documentHash";
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

    if (!validateDocument(values.documentType, values.documentNumber)) {
      toast.error(`Invalid ${values.documentType} number format`);
      return;
    }

    setIsSubmitting(true);
    try {
      const documentHash = await createDocumentHash(values.documentType, values.documentNumber);
      
      // Update profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: values.fullName,
          phone: values.phoneNumber,
          address: values.address
        })
        .eq('id', user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        toast.error("Failed to update profile information");
        return;
      }

      // Submit KYC document
      const { error: submitError } = await supabase
        .from('kyc_document_submissions')
        .insert({
          user_id: user.id,
          document_type: values.documentType,
          document_hash: documentHash,
          verification_status: 'pending',
          submitted_at: new Date().toISOString(),
          wallet_address: isConnected ? window.ethereum?.selectedAddress : null
        });

      if (submitError) {
        console.error("Error submitting KYC:", submitError);
        toast.error("Failed to submit KYC document");
        return;
      }

      // If connected to blockchain, submit there as well
      if (isConnected && submitKYC) {
        try {
          await submitKYC(documentHash);
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
