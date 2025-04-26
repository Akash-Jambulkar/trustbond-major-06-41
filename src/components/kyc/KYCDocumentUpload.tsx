import { useState, useCallback, useRef } from "react";
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
import Web3 from "web3";
import { 
  createDocumentHash, 
  type DocumentType, 
  validateDocument, 
  DOCUMENT_TYPES
} from "@/utils/documentHash";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useMode } from "@/contexts/ModeContext";
import type { ChangeEvent } from "react";
import { KYC_SUBMISSION_FEE } from "@/utils/contracts/contractConfig";

const documentSchema = z.object({
  aadhaarNumber: z.string().refine(val => val === "" || validateDocument(DOCUMENT_TYPES.AADHAAR, val), {
    message: "Invalid Aadhaar number. Must be 12 digits."
  }),
  panNumber: z.string().refine(val => val === "" || validateDocument(DOCUMENT_TYPES.PAN, val), {
    message: "Invalid PAN number. Must be in format ABCDE1234F."
  }),
  voterIdNumber: z.string().refine(val => val === "" || validateDocument(DOCUMENT_TYPES.VOTER_ID, val), {
    message: "Invalid Voter ID. Must be in format ABC1234567."
  }),
  drivingLicenseNumber: z.string().refine(val => val === "" || validateDocument(DOCUMENT_TYPES.DRIVING_LICENSE, val), {
    message: "Invalid Driving License. Must be 8-16 alphanumeric characters."
  })
});

type DocumentFormValues = z.infer<typeof documentSchema>;

export function KYCDocumentUpload() {
  const { toast } = useToast();
  const { submitKYC, isConnected, isContractsInitialized, web3 } = useBlockchain();
  const { enableBlockchain } = useMode();
  const [activeTab, setActiveTab] = useState<DocumentType>(DOCUMENT_TYPES.AADHAAR);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [documentHash, setDocumentHash] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      aadhaarNumber: "",
      panNumber: "",
      voterIdNumber: "",
      drivingLicenseNumber: ""
    },
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setUploadedFile(file);
    setIsUploading(true);
    setFileHash(null);

    try {
      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = "0x" + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

  // Get document verification fee
  const getDocumentVerificationFee = useCallback((): string => {
    return KYC_SUBMISSION_FEE; // Use the constant from the contract config
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Please connect your wallet first"
      });
      return;
    }

    let documentNumber = "";
    switch (activeTab) {
      case DOCUMENT_TYPES.AADHAAR:
        documentNumber = form.getValues().aadhaarNumber;
        break;
      case DOCUMENT_TYPES.PAN:
        documentNumber = form.getValues().panNumber;
        break;
      case DOCUMENT_TYPES.VOTER_ID:
        documentNumber = form.getValues().voterIdNumber;
        break;
      case DOCUMENT_TYPES.DRIVING_LICENSE:
        documentNumber = form.getValues().drivingLicenseNumber;
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
      // Generate document hash
      const documentHash = await createDocumentHash(activeTab, documentNumber);
      setDocumentHash(documentHash);

      if (enableBlockchain && isConnected && web3) {
        // Get verification fee
        const feeInWei = getDocumentVerificationFee();
        console.log("Submitting KYC with fee:", feeInWei);
        
        // Submit KYC with fee
        const result = await submitKYC(documentHash, feeInWei);
        
        if (result) {
          toast({
            title: "KYC document submitted successfully",
            description: `Your document has been submitted for verification on the blockchain with a fee of ${web3.utils.fromWei(feeInWei, 'ether')} ETH.`,
          });
          
          // If we have file hash, store both document and file hash
          if (fileHash) {
            // In a production app, this would securely store the relationship between
            // document hash and file hash in a database, likely through an API call
            console.log("Document hash and file hash stored:", { documentHash, fileHash });
          }
        }
      } else {
        console.log("Mock submission:", { 
          documentType: activeTab, 
          hash: documentHash,
          fee: getDocumentVerificationFee(activeTab)
        });
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Document submitted for processing",
          description: "Your document has been recorded in our system. Blockchain features are currently disabled.",
        });
      }

      // Reset form state
      setUploadedFile(null);
      setFileHash(null);
      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting document:", error);
      toast({
        variant: "destructive",
        title: "Error submitting document",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [form, activeTab, isConnected, enableBlockchain, submitKYC, toast, getDocumentVerificationFee, fileHash, web3]);

  const getCurrentDocumentNumber = (): string => {
    const values = form.getValues();
    switch (activeTab) {
      case DOCUMENT_TYPES.AADHAAR:
        return values.aadhaarNumber;
      case DOCUMENT_TYPES.PAN:
        return values.panNumber;
      case DOCUMENT_TYPES.VOTER_ID:
        return values.voterIdNumber;
      case DOCUMENT_TYPES.DRIVING_LICENSE:
        return values.drivingLicenseNumber;
      default:
        return "";
    }
  };

  const isBlockchainAvailable = enableBlockchain && isConnected;

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
            <TabsTrigger value={DOCUMENT_TYPES.AADHAAR}>Aadhaar</TabsTrigger>
            <TabsTrigger value={DOCUMENT_TYPES.PAN}>PAN</TabsTrigger>
            <TabsTrigger value={DOCUMENT_TYPES.VOTER_ID}>Voter ID</TabsTrigger>
            <TabsTrigger value={DOCUMENT_TYPES.DRIVING_LICENSE}>Driving License</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <TabsContent value={DOCUMENT_TYPES.AADHAAR}>
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

              <TabsContent value={DOCUMENT_TYPES.PAN}>
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

              <TabsContent value={DOCUMENT_TYPES.VOTER_ID}>
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

              <TabsContent value={DOCUMENT_TYPES.DRIVING_LICENSE}>
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

              {enableBlockchain && isConnected && (
                <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Verification Fee Required</AlertTitle>
                  <AlertDescription>
                    <p>A verification fee of <strong>{getDocumentVerificationFee(activeTab)} ETH</strong> will be charged for submitting this document to the blockchain for verification.</p>
                    <p className="mt-2 text-xs">This fee covers the verification process and blockchain transaction costs.</p>
                  </AlertDescription>
                </Alert>
              )}

              {!enableBlockchain && (
                <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Blockchain features are disabled</AlertTitle>
                  <AlertDescription>
                    Your document will be processed using our standard verification system. Enable blockchain features in settings for enhanced security.
                  </AlertDescription>
                </Alert>
              )}

              {enableBlockchain && !isConnected && (
                <Alert className="mt-4 bg-amber-50 border-amber-200 text-amber-800">
                  <Info className="h-4 w-4" />
                  <AlertTitle>You can still submit your documents</AlertTitle>
                  <AlertDescription>
                    <p>Your documents will be processed through our standard verification system. Connect a wallet in settings for blockchain verification.</p>
                    <p className="mt-2 text-xs">Note: Blockchain verification requires a fee of {getDocumentVerificationFee(activeTab)} ETH.</p>
                  </AlertDescription>
                </Alert>
              )}

              <div className="pt-4">
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
                    isBlockchainAvailable ? 
                    `Submit for Verification (${web3 ? web3.utils.fromWei(getDocumentVerificationFee(), 'ether') : '0.01'} ETH)` : 
                    "Submit Document for Processing"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground flex flex-col items-start">
        <p className="mb-1">
          <span className="font-semibold">Security Note:</span> Your document data is securely hashed and only the hash is stored on our systems. No personal information is exposed.
        </p>
        <p>
          <span className="font-semibold">Verification Process:</span> After submission, a bank or authorized entity will verify your documents and update your KYC status.
        </p>
      </CardFooter>
    </Card>
  );
}
