import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Upload, FileUp, Loader2 } from "lucide-react";
import { calculateDocumentHash } from "@/utils/documentHash";
import { useKYCBlockchain } from "@/hooks/useKYCBlockchain";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { useMode } from "@/contexts/ModeContext";
import { saveKycSubmission } from "@/utils/supabase/kycSubmissions";

export const KYCDocumentUpload = () => {
  const { isConnected, account } = useBlockchain();
  const { isProductionMode } = useMode();
  const { isSubmitting, hasSubmitted, submitKYC, checkDocumentHashUniqueness } = useKYCBlockchain();
  
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const uploadFileToStorage = async (file: File) => {
    // For demo purposes, return a mock URL
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `https://mock-storage.example.com/${file.name}`;
  };

  const saveSubmissionToDatabase = async (
    documentHash: string, 
    documentUrl: string
  ) => {
    if (!account) return false;
    
    try {
      const submission = {
        user_id: account,
        document_type: documentType,
        document_number: documentNumber,
        document_hash: documentHash,
        document_url: documentUrl,
        submitted_at: new Date().toISOString(),
        verification_status: 'pending' as const,
      };
      
      const id = await saveKycSubmission(submission);
      return !!id;
    } catch (error) {
      console.error("Error saving to database:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!documentType) {
      toast.error("Please select a document type");
      return;
    }

    if (!documentNumber) {
      toast.error("Please enter a document number");
      return;
    }

    if (!documentFile) {
      toast.error("Please select a document file");
      return;
    }

    setIsUploading(true);
    try {
      // Step 1: Calculate document hash
      const hash = await calculateDocumentHash(documentFile, documentNumber);
      
      // Step 2: Check if hash is unique on blockchain
      const isUnique = await checkDocumentHashUniqueness(hash);
      if (!isUnique) {
        toast.error("This document has already been submitted");
        return;
      }
      
      // Step 3: Upload file to storage
      const documentUrl = await uploadFileToStorage(documentFile);
      setUploadedUrl(documentUrl);
      
      // Step 4: Save to database
      await saveSubmissionToDatabase(hash, documentUrl);
      
      // Step 5: Submit to blockchain
      const txHash = await submitKYC(hash, documentType);
      
      if (txHash) {
        toast.success("KYC document submitted successfully");
      }
    } catch (error) {
      console.error("Error in KYC submission process:", error);
      toast.error("Failed to complete KYC submission");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
        <CardDescription>
          Upload your identification documents for KYC verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to upload documents.
            </AlertDescription>
          </Alert>
        )}

        {hasSubmitted && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              You have already submitted your KYC documents. Your verification is in progress.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type</Label>
            <Select 
              value={documentType} 
              onValueChange={setDocumentType}
              disabled={isSubmitting || isUploading || hasSubmitted}
            >
              <SelectTrigger id="documentType">
                <SelectValue placeholder="Select Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national_id">National ID</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="driving_license">Driving License</SelectItem>
                <SelectItem value="voter_id">Voter ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentNumber">Document Number</Label>
            <Input
              id="documentNumber"
              placeholder="Enter document number"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              disabled={isSubmitting || isUploading || hasSubmitted}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentFile">Upload Document</Label>
            <div className="border-2 border-dashed rounded-md p-4 text-center">
              {documentFile ? (
                <div className="space-y-1">
                  <FileUp className="mx-auto h-8 w-8 text-trustbond-primary" />
                  <p className="text-sm font-medium">{documentFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(documentFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-1 py-4">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG or PDF (max. 10MB)
                  </p>
                </div>
              )}
              <Input
                id="documentFile"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isSubmitting || isUploading || hasSubmitted}
              />
            </div>
          </div>

          {isProductionMode && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                In production mode, your document will be securely stored and verified through a blockchain consensus mechanism.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={
            !isConnected ||
            isSubmitting ||
            isUploading ||
            hasSubmitted ||
            !documentType ||
            !documentNumber ||
            !documentFile
          }
          className="w-full"
        >
          {(isSubmitting || isUploading) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isSubmitting
            ? "Submitting to Blockchain..."
            : isUploading
            ? "Uploading Document..."
            : "Submit KYC Document"}
        </Button>
      </CardFooter>
    </Card>
  );
};
