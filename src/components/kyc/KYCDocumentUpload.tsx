import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { File, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import { useKYCBlockchain } from "@/hooks/useKYCBlockchain";
import { 
  hashDocument, 
  createDocumentHash, 
  DOCUMENT_TYPES, 
  DocumentType,
  validateDocument
} from "@/utils/documentHash";

export const KYCDocumentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [documentNumber, setDocumentNumber] = useState("");
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const { submitKYC, isSubmitting, hasSubmitted, documentHash, checkDocumentHashUniqueness } = useKYCBlockchain();
  const [isUnique, setIsUnique] = useState<boolean | null>(null);
  const [isCheckingUniqueness, setIsCheckingUniqueness] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        if (reader.result) {
          const hash = await hashDocument(reader.result.toString());
          setFileHash(hash);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error hashing file:", error);
      toast.error("Failed to process document");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/plain': ['.txt', '.pdf'],
      'image/jpeg': ['.jpeg', '.jpg', '.png'],
    },
  });

  const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentNumber(e.target.value);
  };

  const handleDocumentTypeChange = (value: string) => {
    setSelectedDocumentType(value);
  };

  const generateDocumentHash = async () => {
    if (!selectedDocumentType || !documentNumber || !fileHash) {
      toast.error("Please fill all required fields and upload a document");
      return null;
    }
    
    try {
      // Convert the selected document type to the expected enum value
      const docType = selectedDocumentType as DocumentType;
      
      // Using createDocumentHash with all three required parameters
      return await createDocumentHash(docType, documentNumber, fileHash);
    } catch (error) {
      console.error("Error generating document hash:", error);
      toast.error("Failed to generate document hash");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!selectedDocumentType || !documentNumber || !fileHash) {
      toast.error("Please fill all required fields and upload a document");
      return;
    }

    if (!validateDocument(selectedDocumentType as DocumentType, documentNumber)) {
      toast.error("Invalid document number format");
      return;
    }

    setIsCheckingUniqueness(true);
    try {
      const isDocHashUnique = await checkDocumentHashUniqueness(fileHash);
      setIsUnique(isDocHashUnique);

      if (!isDocHashUnique) {
        toast.error("This document hash is already in use. Please upload a different document.");
        return;
      }

      const generatedHash = await generateDocumentHash();
      if (generatedHash) {
        await submitKYC(generatedHash, selectedDocumentType);
      }
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC document");
    } finally {
      setIsCheckingUniqueness(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors" {...getRootProps()}>
        <input {...getInputProps()} />
        {selectedFile ? (
          <div className="flex flex-col items-center justify-center">
            <File className="h-8 w-8 text-gray-400 mb-2" />
            <span className="font-medium text-sm">{selectedFile.name}</span>
            <span className="text-xs text-gray-500 mt-1">
              {selectedFile.type} - {(selectedFile.size / 1024).toFixed(2)} KB
            </span>
            {fileHash && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  File Hash:
                </span>
                <span className="font-mono text-xs break-all">
                  {fileHash}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="font-medium text-sm">Click to upload or drag and drop your document</span>
            <span className="text-xs text-gray-500 mt-1">
              Accepts .txt, .pdf, .jpeg, and .png files
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="document-type">Document Type</Label>
          <Select onValueChange={handleDocumentTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="document-number">Document Number</Label>
          <Input
            type="text"
            id="document-number"
            placeholder="Enter document number"
            value={documentNumber}
            onChange={handleDocumentNumberChange}
          />
        </div>
      </div>

      {isUnique === false && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Duplicate Document Detected
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>This document has already been submitted. Please upload a unique document.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasSubmitted ? (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Document Submitted
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your document has been submitted for verification.</p>
                {documentHash && (
                  <p>Document Hash: <span className="font-mono">{documentHash}</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || isCheckingUniqueness || !selectedFile || !selectedDocumentType || !documentNumber}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Document"
          )}
        </Button>
      )}
    </div>
  );
};
