
import { useState, useRef, ChangeEvent } from "react";
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload, FileText, CheckCircle2, AlertCircle, Info, Shield } from "lucide-react";
import { 
  hashDocument, 
  DocumentType, 
  validateDocument, 
  createDocumentHash 
} from "@/utils/documentHash";
import { useBlockchain } from "@/contexts/BlockchainContext";

// Create a schema for form validation
const documentSchema = z.object({
  aadhaarNumber: z.string().refine(val => val === "" || validateDocument(DocumentType.AADHAAR, val), {
    message: "Invalid Aadhaar number. Must be 12 digits."
  }),
  panNumber: z.string().refine(val => val === "" || validateDocument(DocumentType.PAN, val), {
    message: "Invalid PAN number. Must be in format ABCDE1234F."
  }),
  voterIdNumber: z.string().refine(val => val === "" || validateDocument(DocumentType.VOTER_ID, val), {
    message: "Invalid Voter ID. Must be in format ABC1234567."
  }),
  drivingLicenseNumber: z.string().refine(val => val === "" || validateDocument(DocumentType.DRIVING_LICENSE, val), {
    message: "Invalid Driving License. Must be 8-16 alphanumeric characters."
  })
});

type DocumentFormValues = z.infer<typeof documentSchema>;

export const KYCDocumentUpload = () => {
  const { toast } = useToast();
  const { submitKYC, isConnected } = useBlockchain();
  const [activeTab, setActiveTab] = useState<DocumentType>(DocumentType.AADHAAR);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [documentHash, setDocumentHash] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      aadhaarNumber: "",
      panNumber: "",
      voterIdNumber: "",
      drivingLicenseNumber: ""
    },
  });

  // Handle file upload
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setUploadedFile(file);
    setIsUploading(true);
    setFileHash(null);

    try {
      // Read the file as an ArrayBuffer
      const fileBuffer = await file.arrayBuffer();
      // Convert the ArrayBuffer to a string for hashing
      const fileString = new TextDecoder().decode(new Uint8Array(fileBuffer));
      // Hash the file content
      const hash = await hashDocument(fileString);
      setFileHash(hash);
      toast({
        title: "File hashed successfully",
        description: `Hash: ${hash.substring(0, 10)}...`,
      });
    } catch (error) {
      console.error("Error hashing file:", error);
      toast({
        variant: "destructive",
        title: "Error hashing file",
        description: "Please try again with a different file.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Create document hash and submit to blockchain
  const handleSubmit = async (values: DocumentFormValues) => {
    if (!fileHash) {
      toast({
        variant: "destructive",
        title: "No file uploaded",
        description: "Please upload a document file first.",
      });
      return;
    }

    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to submit KYC documents.",
      });
      return;
    }

    let documentNumber = "";
    switch (activeTab) {
      case DocumentType.AADHAAR:
        documentNumber = values.aadhaarNumber;
        break;
      case DocumentType.PAN:
        documentNumber = values.panNumber;
        break;
      case DocumentType.VOTER_ID:
        documentNumber = values.voterIdNumber;
        break;
      case DocumentType.DRIVING_LICENSE:
        documentNumber = values.drivingLicenseNumber;
        break;
    }

    if (!documentNumber) {
      toast({
        variant: "destructive",
        title: "Missing document number",
        description: `Please enter your ${activeTab} number.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a hash that combines document type, number, and file hash
      const hash = await createDocumentHash(activeTab, documentNumber, fileHash);
      setDocumentHash(hash);

      // Submit the hash to the blockchain
      await submitKYC(hash);
      
      toast({
        title: "KYC document submitted successfully",
        description: "Your document has been submitted for verification.",
      });

      // Reset form
      setUploadedFile(null);
      setFileHash(null);
      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting KYC document:", error);
      toast({
        variant: "destructive",
        title: "Error submitting document",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the current document number based on active tab
  const getCurrentDocumentNumber = (): string => {
    const values = form.getValues();
    switch (activeTab) {
      case DocumentType.AADHAAR:
        return values.aadhaarNumber;
      case DocumentType.PAN:
        return values.panNumber;
      case DocumentType.VOTER_ID:
        return values.voterIdNumber;
      case DocumentType.DRIVING_LICENSE:
        return values.drivingLicenseNumber;
      default:
        return "";
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
          Upload your identity documents for KYC verification. Your documents are securely hashed and stored on the blockchain.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as DocumentType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value={DocumentType.AADHAAR}>Aadhaar</TabsTrigger>
            <TabsTrigger value={DocumentType.PAN}>PAN</TabsTrigger>
            <TabsTrigger value={DocumentType.VOTER_ID}>Voter ID</TabsTrigger>
            <TabsTrigger value={DocumentType.DRIVING_LICENSE}>Driving License</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <TabsContent value={DocumentType.AADHAAR}>
                <FormField
                  control={form.control}
                  name="aadhaarNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter 12-digit Aadhaar number" 
                          {...field} 
                          maxLength={12}
                        />
                      </FormControl>
                      <FormDescription>
                        Your 12-digit Unique Identification Number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value={DocumentType.PAN}>
                <FormField
                  control={form.control}
                  name="panNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter 10-character PAN number" 
                          {...field} 
                          maxLength={10}
                          style={{ textTransform: 'uppercase' }}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Your Permanent Account Number in format ABCDE1234F
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value={DocumentType.VOTER_ID}>
                <FormField
                  control={form.control}
                  name="voterIdNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voter ID Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter Voter ID number" 
                          {...field} 
                          maxLength={10}
                          style={{ textTransform: 'uppercase' }}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Your Voter ID number issued by Election Commission
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value={DocumentType.DRIVING_LICENSE}>
                <FormField
                  control={form.control}
                  name="drivingLicenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driving License Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter Driving License number" 
                          {...field} 
                          maxLength={16}
                          style={{ textTransform: 'uppercase' }}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Your Driving License number issued by RTO
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <div className="pt-2">
                <FormLabel>Upload Document</FormLabel>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {!uploadedFile ? (
                    <>
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-trustbond-primary hover:text-trustbond-primary/90 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileText className="h-10 w-10 text-trustbond-primary" />
                      <p className="mt-2 text-sm font-medium text-gray-900">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                      {fileHash && (
                        <div className="mt-2 flex items-center text-xs text-green-600">
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          <span>File hashed: {fileHash.substring(0, 8)}...{fileHash.substring(fileHash.length - 8)}</span>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null);
                          setFileHash(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {documentHash && (
                <Alert className="mt-4 bg-green-50 border-green-200 text-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Document submitted successfully</AlertTitle>
                  <AlertDescription className="mt-2">
                    <p className="text-xs font-mono break-all">
                      Document hash: {documentHash}
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {!isConnected && (
                <Alert className="mt-4 bg-amber-50 border-amber-200 text-amber-800">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Connect wallet to submit</AlertTitle>
                  <AlertDescription>
                    You need to connect your wallet to submit KYC documents to the blockchain.
                  </AlertDescription>
                </Alert>
              )}

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || isUploading || !fileHash || !isConnected}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Document for Verification"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground flex flex-col items-start">
        <p className="mb-1">
          <span className="font-semibold">Security Note:</span> Your document data is securely hashed and only the hash is stored on the blockchain. No personal information is exposed.
        </p>
        <p>
          <span className="font-semibold">Verification Process:</span> After submission, a bank or authorized entity will verify your documents and update your KYC status.
        </p>
      </CardFooter>
    </Card>
  );
};
