
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FilePenLine, Upload, ShieldCheck, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useMode } from "@/contexts/ModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { hashDocument, validateDocument, DocumentType } from "@/utils/documentHash";

const KYCPage = () => {
  const [activeTab, setActiveTab] = useState<string>("aadhaar");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentHash, setDocumentHash] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [submittedDocuments, setSubmittedDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { kycContract, account, isConnected, submitKYC, getKYCStatus } = useBlockchain();
  const { enableBlockchain } = useMode();
  const { user } = useAuth();

  useEffect(() => {
    fetchSubmittedDocuments();
  }, [user]);

  const fetchSubmittedDocuments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('kyc_document_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
        
      if (error) throw error;
      setSubmittedDocuments(data || []);
    } catch (error) {
      console.error("Error fetching KYC documents:", error);
      toast.error("Failed to load your submitted documents");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a simple hash for demo purposes
  const generateFileHash = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as ArrayBuffer;
        const hashArray = Array.from(new Uint8Array(content)).map(b => b.toString(16).padStart(2, '0'));
        const hash = "0x" + hashArray.join('').substring(0, 64);
        resolve(hash);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const hash = await generateFileHash(file);
      setFileHash(hash);
      toast.success("Document prepared for submission");
    } catch (error) {
      console.error("Error preparing document:", error);
      toast.error("Failed to prepare document");
    }
  };

  const validateCurrentDocumentNumber = (): boolean => {
    let isValid = false;
    const documentType = activeTab as DocumentType;
    
    switch (documentType) {
      case 'aadhaar':
        isValid = /^\d{12}$/.test(documentNumber);
        if (!isValid) toast.error("Aadhaar number must be 12 digits");
        break;
      case 'pan':
        isValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(documentNumber);
        if (!isValid) toast.error("PAN must be in format ABCDE1234F");
        break;
      case 'voter_id':
        isValid = /^[A-Z]{3}[0-9]{7}$/.test(documentNumber);
        if (!isValid) toast.error("Voter ID must be in format ABC1234567");
        break;
      case 'driving_license':
        isValid = /^[A-Z0-9]{8,16}$/.test(documentNumber);
        if (!isValid) toast.error("Driving License must be 8-16 alphanumeric characters");
        break;
    }
    
    return isValid;
  };

  const handleSubmitKYC = async () => {
    if (!fileHash) {
      toast.error("Please select a document file first");
      return;
    }

    if (!validateCurrentDocumentNumber()) {
      return;
    }

    if (enableBlockchain && !isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate a document hash combining document type, number and file hash
      const combinedDocHash = await hashDocument(`${activeTab}:${documentNumber}:${fileHash}`);
      setDocumentHash(combinedDocHash);
      
      let blockchainTxHash = null;
      
      // Submit to blockchain if enabled
      if (enableBlockchain && isConnected) {
        blockchainTxHash = await submitKYC(combinedDocHash);
      }
      
      // Store in database
      const { data, error } = await supabase
        .from('kyc_document_submissions')
        .insert({
          document_type: activeTab,
          document_number: documentNumber,
          document_hash: combinedDocHash,
          blockchain_tx_hash: blockchainTxHash
        })
        .select();
      
      if (error) throw error;
      
      // Reset form
      setDocumentNumber("");
      setFileHash("");
      
      // Refresh documents list
      fetchSubmittedDocuments();
      
      toast.success("KYC document successfully submitted!");
    } catch (error) {
      console.error("KYC submission error:", error);
      toast.error("Failed to submit KYC document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Verified</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-amber-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Pending</span>
          </div>
        );
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'aadhaar': return 'Aadhaar Card';
      case 'pan': return 'PAN Card';
      case 'voter_id': return 'Voter ID';
      case 'driving_license': return 'Driving License';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePenLine className="h-6 w-6" />
            Submit KYC Documents
          </CardTitle>
          <CardDescription>
            Upload your identity documents for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="aadhaar">Aadhaar</TabsTrigger>
              <TabsTrigger value="pan">PAN</TabsTrigger>
              <TabsTrigger value="voter_id">Voter ID</TabsTrigger>
              <TabsTrigger value="driving_license">Driving License</TabsTrigger>
            </TabsList>

            <TabsContent value="aadhaar" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input 
                  id="aadhaar" 
                  type="text" 
                  placeholder="Enter 12-digit Aadhaar number" 
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  maxLength={12}
                />
                <p className="text-sm text-gray-500">
                  Your 12-digit Unique Identification Number
                </p>
              </div>
            </TabsContent>

            <TabsContent value="pan" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input 
                  id="pan" 
                  type="text" 
                  placeholder="Enter 10-character PAN number" 
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="uppercase"
                />
                <p className="text-sm text-gray-500">
                  Your Permanent Account Number in format ABCDE1234F
                </p>
              </div>
            </TabsContent>

            <TabsContent value="voter_id" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voterId">Voter ID Number</Label>
                <Input 
                  id="voterId" 
                  type="text" 
                  placeholder="Enter your Voter ID number" 
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="uppercase"
                />
                <p className="text-sm text-gray-500">
                  Your Electoral Photo Identity Card (EPIC) number
                </p>
              </div>
            </TabsContent>

            <TabsContent value="driving_license" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="drivingLicense">Driving License Number</Label>
                <Input 
                  id="drivingLicense" 
                  type="text" 
                  placeholder="Enter your Driving License number" 
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                  maxLength={16}
                  className="uppercase"
                />
                <p className="text-sm text-gray-500">
                  Your Driving License number issued by RTO
                </p>
              </div>
            </TabsContent>

            <div className="space-y-4 mt-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your document or click to browse
                </p>
                <Input 
                  id="document-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
                <Label 
                  htmlFor="document-upload" 
                  className="bg-trustbond-primary text-white py-2 px-4 rounded cursor-pointer hover:bg-trustbond-primary/90"
                >
                  Select Document
                </Label>
                {fileHash && (
                  <div className="mt-4 p-2 bg-gray-50 border border-gray-200 rounded text-xs break-all">
                    <p className="font-semibold">Document Hash:</p>
                    <p>{fileHash}</p>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSubmitKYC}
            disabled={!fileHash || !documentNumber || isSubmitting || (enableBlockchain && !isConnected)}
          >
            {isSubmitting ? "Submitting..." : "Submit Document"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            Your Submitted Documents
          </CardTitle>
          <CardDescription>
            Track the status of your KYC document submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading your documents...</p>
            </div>
          ) : submittedDocuments.length > 0 ? (
            <div className="space-y-4">
              {submittedDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{getDocumentTypeName(doc.document_type)}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {new Date(doc.submitted_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-mono text-gray-500 mt-1">
                        Hash: {doc.document_hash.substring(0, 16)}...
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(doc.verification_status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg bg-gray-50">
              <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">
                You haven't submitted any documents yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCPage;
