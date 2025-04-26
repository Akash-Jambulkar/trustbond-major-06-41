
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createDocumentHash, DOCUMENT_TYPES } from "@/utils/documentHash";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { KYC_SUBMISSION_FEE } from "@/utils/contracts/contractConfig";
import { supabase } from "@/lib/supabaseClient";

const kycFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(2, "Nationality is required"),
  idNumber: z.string().min(4, "ID number must be at least 4 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
});

type KYCFormValues = z.infer<typeof kycFormSchema>;

export function KYCVerificationForm() {
  const { submitKYC, isConnected, account, web3 } = useBlockchain();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<KYCFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      nationality: "",
      idNumber: "",
      address: "",
      phoneNumber: "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: KYCFormValues) => {
    if (!user) {
      toast.error("Please log in to submit KYC");
      return;
    }

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a single hash from all KYC data
      const kycData = JSON.stringify(data);
      // Use the correct document type from the enum
      const documentHash = await createDocumentHash(DOCUMENT_TYPES.PAN, kycData);

      // Convert verification fee to Wei
      const feeInWei = web3?.utils.toWei(KYC_SUBMISSION_FEE, 'ether');

      // Submit to blockchain (ensure the fee is passed as a string)
      const result = await submitKYC(documentHash, feeInWei ? feeInWei.toString() : '0');

      if (result) {
        // Store KYC data in database
        const { error } = await supabase
          .from('kyc_document_submissions')
          .insert({
            user_id: user.id,
            document_type: 'identity',
            document_hash: documentHash,
            verification_status: 'pending',
            wallet_address: account,
            submitted_at: new Date().toISOString()
          });

        if (error) {
          console.error("Error storing KYC data:", error);
          toast.error("Failed to store KYC data");
          return;
        }

        // Update user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: data.fullName,
            phone: data.phoneNumber,
            address: data.address,
            kyc_status: 'pending',
            wallet_address: account,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }

        toast.success("KYC submitted successfully");
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          KYC Verification Form
        </CardTitle>
        <CardDescription>
          Please fill in all required information for KYC verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            A verification fee of {KYC_SUBMISSION_FEE} ETH is required. Please ensure your wallet is connected.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your nationality" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Government ID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your ID number" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Enter your full address" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={isSubmitting || !isConnected}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : `Submit for Verification (${KYC_SUBMISSION_FEE} ETH)`}
        </Button>
      </CardFooter>
    </Card>
  );
}
