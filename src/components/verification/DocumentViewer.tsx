
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Document, Page, pdfjs } from "react-pdf";
import { Eye, Download, FileText, AlertTriangle, Shield, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBlockchain } from "@/contexts/BlockchainContext";

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
  documentURL: string;
  documentType: string;
  documentHash: string;
  isEncrypted?: boolean;
  onVerify?: (approved: boolean) => void;
  viewOnly?: boolean;
}

export function DocumentViewer({
  documentURL,
  documentType,
  documentHash,
  isEncrypted = false,
  onVerify,
  viewOnly = false
}: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useBlockchain();

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error("Error loading document:", error);
    setError("Failed to load document. Document might be corrupted or in an unsupported format.");
    setIsLoading(false);
  };

  const nextPage = () => {
    if (pageNumber < (numPages || 1)) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const getDocumentTypeIcon = () => {
    switch (documentType.toLowerCase()) {
      case "aadhaar":
      case "aadhar":
        return <Shield className="h-5 w-5 text-trustbond-primary" />;
      case "pan":
        return <FileText className="h-5 w-5 text-trustbond-primary" />;
      default:
        return <FileText className="h-5 w-5 text-trustbond-primary" />;
    }
  };

  const isPDF = documentURL.toLowerCase().endsWith(".pdf");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getDocumentTypeIcon()}
          {documentType} Document Viewer
          {isEncrypted && <Lock className="h-4 w-4 text-amber-500" />}
        </CardTitle>
        <CardDescription>
          Secure document viewing system for KYC verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEncrypted && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Encrypted Document</AlertTitle>
            <AlertDescription className="text-amber-700">
              This document is encrypted and secured. Your access is monitored and logged for security purposes.
            </AlertDescription>
          </Alert>
        )}

        <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] flex justify-center items-center">
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary mx-auto"></div>
              <p className="mt-2">Loading document...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          )}

          {isPDF ? (
            <Document
              file={documentURL}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              className="w-full"
            >
              <Page pageNumber={pageNumber} width={600} />
            </Document>
          ) : (
            <div className="w-full h-full flex justify-center">
              <img
                src={documentURL}
                alt={`${documentType} document`}
                className="max-w-full max-h-[500px] object-contain"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setError("Failed to load image");
                  setIsLoading(false);
                }}
              />
            </div>
          )}
        </div>

        {numPages && numPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={prevPage} disabled={pageNumber <= 1}>
              Previous
            </Button>
            <p className="text-sm">
              Page {pageNumber} of {numPages}
            </p>
            <Button variant="outline" onClick={nextPage} disabled={pageNumber >= numPages}>
              Next
            </Button>
          </div>
        )}

        <div className="mt-4">
          <Label className="text-sm font-medium">Document Hash</Label>
          <div className="p-2 bg-gray-100 rounded font-mono text-xs break-all mt-1">
            {documentHash}
          </div>
        </div>
      </CardContent>
      
      {!viewOnly && onVerify && (
        <CardFooter className="flex justify-between gap-4">
          <Button 
            variant="outline" 
            className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-red-200" 
            onClick={() => onVerify(false)}
            disabled={!isConnected}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Reject Document
          </Button>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            onClick={() => onVerify(true)}
            disabled={!isConnected}
          >
            <Shield className="mr-2 h-4 w-4" />
            Verify Document
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
