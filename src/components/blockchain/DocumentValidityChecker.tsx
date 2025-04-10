
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { verifyDocumentUniqueness, detectPotentialFraud } from "@/utils/uniquenessVerifier";
import { DOCUMENT_TYPES, type DocumentType } from "@/utils/documentHash";
import { Badge } from "../ui/badge";

interface DocumentValidityCheckerProps {
  className?: string;
  onResultsChange?: (results: any) => void;
}

export const DocumentValidityChecker = ({ className, onResultsChange }: DocumentValidityCheckerProps) => {
  const [documentType, setDocumentType] = useState<DocumentType>('aadhaar');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [uniquenessResult, setUniquenessResult] = useState<any>(null);
  const [fraudResult, setFraudResult] = useState<any>(null);
  
  const handleCheck = async () => {
    if (!documentType || !documentNumber) {
      toast.error("Please enter both document type and number");
      return;
    }
    
    setIsChecking(true);
    setUniquenessResult(null);
    setFraudResult(null);
    
    try {
      // Check document uniqueness
      const uniqueness = await verifyDocumentUniqueness(documentType, documentNumber);
      setUniquenessResult(uniqueness);
      
      // Check for potential fraud
      const fraud = await detectPotentialFraud(documentType, documentNumber);
      setFraudResult(fraud);
      
      // Notify parent component of results if callback provided
      if (onResultsChange) {
        onResultsChange({
          uniqueness,
          fraud,
          documentType,
          documentNumber
        });
      }
      
      // Show toast based on results
      if (!uniqueness.isUnique) {
        toast.warning("Document already exists in the system");
      } else if (fraud.isSuspicious) {
        toast.warning("Potential fraud signals detected");
      } else {
        toast.success("Document appears valid and unique");
      }
    } catch (error) {
      console.error("Error checking document:", error);
      toast.error("Failed to validate document");
    } finally {
      setIsChecking(false);
    }
  };
  
  const getDocumentTypeName = (type: DocumentType): string => {
    switch (type) {
      case 'aadhaar': return 'Aadhaar Card';
      case 'pan': return 'PAN Card';
      case 'voter_id': return 'Voter ID';
      case 'driving_license': return 'Driving License';
      default: return type;
    }
  };
  
  const getDocumentPlaceholder = (type: DocumentType): string => {
    switch (type) {
      case 'aadhaar': return '123456789012';
      case 'pan': return 'ABCDE1234F';
      case 'voter_id': return 'ABC1234567';
      case 'driving_license': return 'DL123456789';
      default: return 'Enter document number';
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5" />
          Document Validity Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select 
              value={documentType} 
              onValueChange={(value) => setDocumentType(value as DocumentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                <SelectItem value="pan">PAN Card</SelectItem>
                <SelectItem value="voter_id">Voter ID</SelectItem>
                <SelectItem value="driving_license">Driving License</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document-number">Document Number</Label>
            <Input 
              id="document-number"
              placeholder={getDocumentPlaceholder(documentType)}
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
            />
          </div>
        </div>
        
        {/* Results Section */}
        {(uniquenessResult || fraudResult) && (
          <div className="mt-4 space-y-4">
            {/* Uniqueness Result */}
            {uniquenessResult && (
              <div className={`p-4 rounded-md ${
                uniquenessResult.isUnique 
                  ? "bg-green-50 border border-green-200" 
                  : "bg-amber-50 border border-amber-200"
              }`}>
                <div className="flex items-start gap-2">
                  {uniquenessResult.isUnique ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  )}
                  
                  <div>
                    <h3 className="font-medium">
                      {uniquenessResult.isUnique ? "Document is Unique" : "Document Already Exists"}
                    </h3>
                    <p className="text-sm mt-1">
                      {uniquenessResult.isUnique 
                        ? "This document has not been registered in our system before" 
                        : `This document was previously submitted with status: ${uniquenessResult.existingStatus || "unknown"}`
                      }
                    </p>
                    
                    {!uniquenessResult.isUnique && uniquenessResult.existingDetails && (
                      <div className="mt-2 text-xs">
                        <p>Submitted: {new Date(uniquenessResult.existingDetails.submittedAt).toLocaleString()}</p>
                        {uniquenessResult.existingDetails.transactionHash && (
                          <p className="font-mono">
                            Tx: {uniquenessResult.existingDetails.transactionHash.substring(0, 12)}...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Fraud Detection Result */}
            {fraudResult && fraudResult.isSuspicious && (
              <div className="p-4 rounded-md bg-red-50 border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  
                  <div>
                    <h3 className="font-medium text-red-700">
                      Potential Fraud Signals Detected
                    </h3>
                    <p className="text-sm mt-1 text-red-600">
                      This document has triggered {fraudResult.reasons.length} fraud detection rule(s)
                    </p>
                    
                    {fraudResult.reasons.length > 0 && (
                      <ul className="mt-2 text-xs text-red-600 space-y-1">
                        {fraudResult.reasons.map((reason: string, index: number) => (
                          <li key={index} className="flex items-center gap-1">
                            <span>•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-red-100 border-red-200 text-red-700">
                        Confidence: {Math.round(fraudResult.confidenceScore * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleCheck}
          disabled={isChecking || !documentType || !documentNumber}
        >
          {isChecking ? "Checking..." : "Check Document Validity"}
        </Button>
      </CardFooter>
    </Card>
  );
};
