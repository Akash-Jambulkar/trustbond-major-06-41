import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Shield, 
  FileText,
  AlertTriangle,
  Eye,
  FileCheck,
  FileX 
} from "lucide-react";
import { validateDocument, verifyDocumentUniqueness, DOCUMENT_TYPES } from "@/utils/documentHash";
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";
import { kycSubmissionsTable, usersMetadataTable } from "@/utils/supabase-helper";

const MOCK_KYC_REQUESTS = [
  { 
    id: "1", 
    userAddress: "0x3456789012345678901234567890123456789012", 
    documentType: "Aadhaar Card", 
    documentHash: "0x8a723aef5d7e86c65a3a321e7d77bc",
    submittedAt: "2025-04-08T10:30:00Z",
    status: "pending",
    documentNumber: "123456789012"
  },
  { 
    id: "2", 
    userAddress: "0x4567890123456789012345678901234567890123", 
    documentType: "PAN Card", 
    documentHash: "0x7b834dbf6e97d76b54b2430f8d88ac",
    submittedAt: "2025-04-07T15:45:00Z",
    status: "pending",
    documentNumber: "ABCDE1234F"
  },
  { 
    id: "3", 
    userAddress: "0x5678901234567890123456789012345678901234", 
    documentType: "Voter ID", 
    documentHash: "0x6c945ece7f08e87c65d3541e9e99bd",
    submittedAt: "2025-04-06T09:15:00Z",
    status: "pending",
    documentNumber: "ABC1234567"
  },
];

const VerifyKYCPage = () => {
  const { verifyKYC, isConnected, kycContract } = useBlockchain();
  const [kycRequests, setKycRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [uniquenessCheck, setUniquenessCheck] = useState<{
    isChecking: boolean;
    result: { isUnique: boolean; existingStatus?: string } | null;
  }>({
    isChecking: false,
    result: null
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchKycRequests = async () => {
      setIsLoading(true);
      try {
        let requests = [];
        
        try {
          const { data, error } = await kycSubmissionsTable()
            .select('*')
            .order('submitted_at', { ascending: false });
            
          if (!error && data) {
            requests = data.map((item: KycDocumentSubmissionType) => ({
              id: item.id,
              userAddress: item.blockchain_tx_hash ? item.blockchain_tx_hash : "0x0000000000000000000000000000000000000000",
              documentType: item.document_type,
              documentHash: item.document_hash,
              submittedAt: item.submitted_at,
              status: item.verification_status || "pending",
              documentNumber: item.document_number
            }));
          } else {
            requests = MOCK_KYC_REQUESTS;
          }
        } catch (err) {
          console.error("Error fetching from database:", err);
          requests = MOCK_KYC_REQUESTS;
        }
        
        if (isConnected && kycContract) {
        }
        
        setKycRequests(requests);
      } catch (error) {
        console.error("Error fetching KYC requests:", error);
        toast.error("Failed to fetch KYC requests");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchKycRequests();
  }, [isConnected, kycContract]);
  
  const handleVerify = async (userAddress: string, status: boolean, requestId: string) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsVerifying(true);
    try {
      await verifyKYC(userAddress, status);
      
      try {
        const { error } = await kycSubmissionsTable()
          .update({ 
            verification_status: status ? "verified" : "rejected",
            verified_at: new Date().toISOString()
          })
          .eq('id', requestId);
          
        if (error) {
          console.error("Error updating database:", error);
        }
      } catch (err) {
        console.error("Database update error:", err);
      }
      
      setKycRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId 
            ? { ...req, status: status ? "verified" : "rejected" } 
            : req
        )
      );
      
      toast.success(`KYC ${status ? 'approved' : 'rejected'} for user`);
      
      if (isDetailsOpen) {
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };
  
  const checkDocumentUniqueness = async (documentType: string, documentNumber: string) => {
    setUniquenessCheck({ isChecking: true, result: null });
    try {
      let systemDocType;
      
      if (documentType.toLowerCase().includes("aadhaar")) {
        systemDocType = DOCUMENT_TYPES.AADHAAR;
      } else if (documentType.toLowerCase().includes("pan")) {
        systemDocType = DOCUMENT_TYPES.PAN;
      } else if (documentType.toLowerCase().includes("voter")) {
        systemDocType = DOCUMENT_TYPES.VOTER_ID;
      } else if (documentType.toLowerCase().includes("driving") || documentType.toLowerCase().includes("license")) {
        systemDocType = DOCUMENT_TYPES.DRIVING_LICENSE;
      } else {
        systemDocType = documentType as any;
      }
      
      const result = await verifyDocumentUniqueness(
        systemDocType, 
        documentNumber,
        supabase
      );
      
      setUniquenessCheck({ isChecking: false, result });
      
      if (!result.isUnique) {
        toast.warning("Document already exists in the system", {
          description: `This document was previously submitted with status: ${result.existingStatus || "unknown"}`
        });
      } else {
        toast.success("Document is unique", {
          description: "This document hasn't been submitted before"
        });
      }
    } catch (error) {
      console.error("Error checking document uniqueness:", error);
      setUniquenessCheck({ isChecking: false, result: null });
      toast.error("Failed to check document uniqueness");
    }
  };
  
  const viewRequestDetails = (request: any) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
    setUniquenessCheck({ isChecking: false, result: null });
  };
  
  const filteredRequests = kycRequests.filter(req => 
    req.userAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.documentHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (req.documentNumber && req.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const pendingRequests = filteredRequests.filter(req => req.status === "pending");
  const verifiedRequests = filteredRequests.filter(req => req.status === "verified");
  const rejectedRequests = filteredRequests.filter(req => req.status === "rejected");
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Verify KYC Documents</h1>
          <p className="text-muted-foreground">
            Review and verify customer KYC documents submitted through the blockchain.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-trustbond-primary" />
              KYC Verification Requests
            </CardTitle>
            <CardDescription>
              Review document hashes, verify identity, and approve or reject KYC submissions.
            </CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by address, document type or number..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading KYC requests...</p>
              </div>
            ) : (
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Pending ({pendingRequests.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="verified" className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verified ({verifiedRequests.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    <span>Rejected ({rejectedRequests.length})</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="mt-4">
                  {pendingRequests.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User Address</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Document Hash</TableHead>
                          <TableHead>Submitted At</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-mono text-xs">
                              {request.userAddress.substring(0, 6)}...{request.userAddress.substring(request.userAddress.length - 4)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-trustbond-primary" />
                                {request.documentType}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {request.documentHash.substring(0, 8)}...{request.documentHash.substring(request.documentHash.length - 8)}
                            </TableCell>
                            <TableCell>
                              {new Date(request.submittedAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
                                  onClick={() => viewRequestDetails(request)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Details
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                                  onClick={() => handleVerify(request.userAddress, true, request.id)}
                                  disabled={isVerifying || !isConnected}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                                  onClick={() => handleVerify(request.userAddress, false, request.id)}
                                  disabled={isVerifying || !isConnected}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No pending KYC requests found
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="verified" className="mt-4">
                  {verifiedRequests.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User Address</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Document Hash</TableHead>
                          <TableHead>Submitted At</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {verifiedRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-mono text-xs">
                              {request.userAddress.substring(0, 6)}...{request.userAddress.substring(request.userAddress.length - 4)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileCheck className="h-4 w-4 text-green-600" />
                                {request.documentType}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {request.documentHash.substring(0, 8)}...{request.documentHash.substring(request.documentHash.length - 8)}
                            </TableCell>
                            <TableCell>
                              {new Date(request.submittedAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Verified
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No verified KYC requests found
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rejected" className="mt-4">
                  {rejectedRequests.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User Address</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Document Hash</TableHead>
                          <TableHead>Submitted At</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rejectedRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-mono text-xs">
                              {request.userAddress.substring(0, 6)}...{request.userAddress.substring(request.userAddress.length - 4)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileX className="h-4 w-4 text-red-600" />
                                {request.documentType}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {request.documentHash.substring(0, 8)}...{request.documentHash.substring(request.documentHash.length - 8)}
                            </TableCell>
                            <TableCell>
                              {new Date(request.submittedAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Rejected
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No rejected KYC requests found
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="bg-muted/50 text-xs text-muted-foreground flex flex-col items-start">
            <p className="mb-1">
              <span className="font-semibold">Verification Process:</span> Review document hashes and user information before approving or rejecting KYC requests.
            </p>
            <p>
              <span className="font-semibold">Security Note:</span> All verifications are recorded on the blockchain for transparency and auditability.
            </p>
          </CardFooter>
        </Card>
        
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>KYC Request Details</DialogTitle>
              <DialogDescription>
                Verify document details and check for potential fraud
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Document Type</p>
                    <p className="font-medium">{selectedRequest.documentType}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Submitted At</p>
                    <p>{new Date(selectedRequest.submittedAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">User Address</p>
                    <p className="font-mono text-sm">{selectedRequest.userAddress}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Document Hash</p>
                    <p className="font-mono text-sm break-all">{selectedRequest.documentHash}</p>
                  </div>
                </div>
                
                {selectedRequest.documentNumber && (
                  <div className="space-y-2 pb-2 border-b">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Document Number</p>
                        <p className="font-mono">{selectedRequest.documentNumber}</p>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => checkDocumentUniqueness(selectedRequest.documentType, selectedRequest.documentNumber)}
                        disabled={uniquenessCheck.isChecking}
                        className="flex items-center gap-1"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {uniquenessCheck.isChecking ? "Checking..." : "Check Uniqueness"}
                      </Button>
                    </div>
                    
                    {uniquenessCheck.result && (
                      <div className={`p-3 rounded-md mt-2 ${
                        uniquenessCheck.result.isUnique 
                          ? "bg-green-50 border border-green-200 text-green-700" 
                          : "bg-amber-50 border border-amber-200 text-amber-700"
                      }`}>
                        {uniquenessCheck.result.isUnique ? (
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 mt-0.5" />
                            <div>
                              <p className="font-medium">Document is unique</p>
                              <p className="text-sm">This document has not been used before in the system</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 mt-0.5" />
                            <div>
                              <p className="font-medium">Duplicate document detected</p>
                              <p className="text-sm">This document has already been submitted with status: {uniquenessCheck.result.existingStatus || "unknown"}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="pt-2">
                  <p className="font-medium mb-3">Verification Decision</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleVerify(selectedRequest.userAddress, true, selectedRequest.id)}
                      disabled={isVerifying || !isConnected}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve KYC
                    </Button>
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => handleVerify(selectedRequest.userAddress, false, selectedRequest.id)}
                      disabled={isVerifying || !isConnected}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject KYC
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default VerifyKYCPage;
