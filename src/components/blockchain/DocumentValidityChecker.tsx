import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DOCUMENT_TYPES, DocumentType, validateDocument } from '@/utils/documentHash';
import { createDocumentHash, compareDocumentHashes } from '@/utils/documentHash';
import { toast } from 'sonner';

interface DocumentValidityCheckerProps {
  onValidityCheck: (isValid: boolean) => void;
}

const DocumentValidityChecker: React.FC<DocumentValidityCheckerProps> = ({ onValidityCheck }) => {
  const [documentType, setDocumentType] = useState<DocumentType>(DOCUMENT_TYPES.AADHAAR);
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [documentHash, setDocumentHash] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentType(e.target.value as DocumentType);
    setDocumentNumber('');
    setDocumentHash('');
    setIsValid(null);
  };

  const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentNumber(e.target.value);
    setIsValid(null);
  };

  const handleDocumentHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentHash(e.target.value);
    setIsValid(null);
  };

  const handleCheckValidity = async () => {
    if (!documentNumber || !documentHash) {
      toast.error('Please enter both document number and document hash.');
      return;
    }

    if (!validateDocument(documentType, documentNumber)) {
      toast.error(`Invalid ${documentType} number format.`);
      return;
    }

    setIsLoading(true);
    try {
      const newHash = await createDocumentHash(documentType, documentNumber);
      const isValidDocument = compareDocumentHashes(newHash, documentHash);
      setIsValid(isValidDocument);
      onValidityCheck(isValidDocument);

      if (isValidDocument) {
        toast.success('Document is valid!');
      } else {
        toast.error('Document is invalid.');
      }
    } catch (error) {
      console.error('Error checking document validity:', error);
      toast.error('Failed to check document validity.');
      setIsValid(false);
      onValidityCheck(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Document Validity Checker</CardTitle>
        <CardDescription>
          Verify the validity of your document by entering the details below.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="documentType">Document Type</Label>
          <select
            id="documentType"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={documentType}
            onChange={handleDocumentTypeChange}
          >
            <option value={DOCUMENT_TYPES.AADHAAR}>Aadhaar</option>
            <option value={DOCUMENT_TYPES.PAN}>PAN</option>
            <option value={DOCUMENT_TYPES.VOTER_ID}>Voter ID</option>
            <option value={DOCUMENT_TYPES.DRIVING_LICENSE}>Driving License</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="documentNumber">Document Number</Label>
          <Input
            id="documentNumber"
            placeholder={`Enter ${documentType} number`}
            value={documentNumber}
            onChange={handleDocumentNumberChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="documentHash">Document Hash</Label>
          <Input
            id="documentHash"
            placeholder="Enter document hash"
            value={documentHash}
            onChange={handleDocumentHashChange}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isValid !== null && (
          <div className={isValid ? "text-green-500" : "text-red-500"}>
            {isValid ? "Document is Valid" : "Document is Invalid"}
          </div>
        )}
        <Button onClick={handleCheckValidity} disabled={isLoading}>
          {isLoading ? "Checking..." : "Check Validity"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentValidityChecker;
