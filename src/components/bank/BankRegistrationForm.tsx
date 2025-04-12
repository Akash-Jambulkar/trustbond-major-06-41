
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

// Form validation schema
const bankRegistrationSchema = z.object({
  name: z.string().min(3, { message: "Bank name must be at least 3 characters" }),
  regNumber: z.string().min(5, { message: "Registration number must be at least 5 characters" }),
  address: z.string().min(10, { message: "Address must be at least 10 characters" }),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }),
  contactPhone: z.string().min(10, { message: "Please enter a valid phone number" }),
  bankType: z.enum(["commercial", "cooperative", "investment", "central", "specialized"]),
  description: z.string().optional(),
});

type BankRegistrationFormValues = z.infer<typeof bankRegistrationSchema>;

export function BankRegistrationForm() {
  const { account, isConnected, registerBank } = useBlockchain();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);

  const form = useForm<BankRegistrationFormValues>({
    resolver: zodResolver(bankRegistrationSchema),
    defaultValues: {
      name: "",
      regNumber: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      bankType: "commercial",
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVerificationFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: BankRegistrationFormValues) => {
    if (!verificationFile) {
      toast.error("Please upload verification document");
      return;
    }

    if (!isConnected) {
      toast.error("Please connect your wallet to register");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload verification document to storage
      // This would typically involve a call to upload the file to Supabase or similar
      const documentUploadResponse = { documentId: "sample-doc-id-" + Date.now() }; // Placeholder
      
      // 2. Register on blockchain if document upload successful
      if (documentUploadResponse.documentId) {
        // Call blockchain registration function (implemented in BlockchainContext)
        if (registerBank) {
          await registerBank(data.name, data.regNumber, account);
          
          // 3. Save additional details to database
          // This would typically involve a call to save data to your database
          
          toast.success("Bank registration submitted successfully", {
            description: "Your application is now pending review",
          });
          
          form.reset();
          setVerificationFile(null);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register bank", {
        description: "Please try again later",
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
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
                name="regNumber"
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
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registered Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full registered address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Official email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Official phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="bankType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial Bank</SelectItem>
                      <SelectItem value="cooperative">Cooperative Bank</SelectItem>
                      <SelectItem value="investment">Investment Bank</SelectItem>
                      <SelectItem value="central">Central Bank</SelectItem>
                      <SelectItem value="specialized">Specialized Bank</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of your institution" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Verification Document</FormLabel>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="file" 
                  id="verification-doc" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="application/pdf,image/png,image/jpeg"
                />
                <label htmlFor="verification-doc" className="cursor-pointer flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="font-medium text-sm">
                    {verificationFile ? verificationFile.name : "Click to upload verification document"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Banking license or regulatory approval document (PDF, PNG, JPEG)
                  </span>
                </label>
              </div>
              {verificationFile && (
                <p className="text-xs flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  Document selected: {verificationFile.name}
                </p>
              )}
            </div>

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
