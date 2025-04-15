
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOCUMENT_TYPES, DocumentType, createDocumentHash, validateDocument } from "@/utils/documentHash";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { ArrowUpCircle, FileText, Shield } from "lucide-react";

export function KYCDocumentUpload() {
  const { submitKYC, isConnected } = useBlockchain();
  const [documentType, setDocumentType] = useState<DocumentType>(DOCUMENT_TYPES.PAN);
  const [documentNumber, setDocumentNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    
    // Create a hash of the file
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target && event.target.result) {
        const arrayBuffer = event.target.result as ArrayBuffer;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setFileHash(`0x${hash}`);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });
  
  const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentNumber(e.target.value);
  };
  
  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value as DocumentType);
  };
  
  const isDocumentValid = () => {
    return validateDocument(documentType, documentNumber);
  };
  
  const handleSubmit = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!file) {
      toast.error("Please upload a document");
      return;
    }
    
    if (!fileHash) {
      toast.error("Please wait for file processing to complete");
      return;
    }
    
    if (!isDocumentValid()) {
      toast.error(`Invalid ${documentType} number format`);
      return;
    }
    
    setIsUploading(true);
    try {
      // Generate the document hash using all three pieces of information
      const documentHash = await createDocumentHash(documentType, documentNumber, fileHash);
      
      // Submit to blockchain
      const success = await submitKYC(documentHash);
      
      if (success) {
        toast.success("Document submitted successfully for verification!");
        // Reset form
        setDocumentNumber("");
        setFile(null);
        setFileHash(null);
      } else {
        toast.error("Failed to submit document");
      }
    } catch (error) {
      console.error("Error submitting document:", error);
      toast.error("An error occurred while submitting your document");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-trustbond-primary" />
          KYC Document Submission
        </CardTitle>
        <CardDescription>
          Upload your identification documents for verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="document-type">Document Type</Label>
          <Select value={documentType} onValueChange={handleDocumentTypeChange}>
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
          <Label htmlFor="document-number">Document Number</Label>
          <Input
            id="document-number"
            placeholder={`Enter your ${documentType} number`}
            value={documentNumber}
            onChange={handleDocumentNumberChange}
          />
          {documentNumber && !isDocumentValid() && (
            <p className="text-sm text-red-500 mt-1">
              Invalid format for {documentType}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Upload Document</Label>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
              isDragActive ? 'border-trustbond-primary bg-trustbond-primary/5' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex flex-col items-center">
                <FileText className="h-8 w-8 text-trustbond-primary mb-2" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : isDragActive ? (
              <div className="flex flex-col items-center">
                <ArrowUpCircle className="h-8 w-8 text-trustbond-primary animate-bounce mb-2" />
                <p className="text-sm">Drop the file here...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileText className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm">Drag and drop a file here, or click to select</p>
                <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, PDF (max 5MB)</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={!isConnected || !file || !fileHash || !isDocumentValid() || isUploading}
          className="w-full"
        >
          {isUploading ? "Submitting..." : "Submit Document for Verification"}
        </Button>
      </CardFooter>
    </Card>
  );
}
