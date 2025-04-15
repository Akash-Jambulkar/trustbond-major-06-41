import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Building2, CheckCircle } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useNavigate } from "react-router-dom";

// Form validation schema
const bankRegistrationSchema = z.object({
  bankName: z.string().min(3, { message: "Bank name must be at least 3 characters" }),
  registrationNumber: z.string().min(5, { message: "Registration number must be at least 5 characters" }),
  documentHash: z.string().min(10, { message: "Document hash must be at least 10 characters" }),
});

type BankRegistrationFormValues = z.infer<typeof bankRegistrationSchema>;

export function BankRegistrationForm() {
  const { account, isConnected, registerBank } = useBlockchain();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<BankRegistrationFormValues>({
    resolver: zodResolver(bankRegistrationSchema),
    defaultValues: {
      bankName: "",
      registrationNumber: "",
      documentHash: "",
    },
  });

  const handleRegister = async () => {
    if (!form.formState.isValid) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const values = form.getValues();
      
      // Convert to a single bankData object as expected by the API
      const bankData = {
        name: values.bankName,
        registrationNumber: values.registrationNumber,
        walletAddress: account,
        documentHash: values.documentHash
      };
      
      // Call registerBank with just the bankData object
      await registerBank?.(bankData);
      
      toast.success("Bank registration submitted successfully", {
        description: "Your application is pending approval",
      });
      
      navigate("/dashboard/bank");
    } catch (error) {
      console.error("Error registering bank:", error);
      toast.error("Failed to register bank", {
        description: "Please try again or contact support",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Bank Registration
        </CardTitle>
        <CardDescription>
          Register your institution in the TrustBond network to participate in the KYC sharing system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Official registration number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentHash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Hash</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document hash" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !isConnected}
            >
              {isSubmitting ? "Submitting..." : "Register Bank"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col text-center text-sm text-muted-foreground">
        <p>
          By registering, you agree to participate in the TrustBond network and adhere to its governance rules.
        </p>
      </CardFooter>
    </Card>
  );
}
