
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
import { toast } from "sonner";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Shield, 
  FileText 
} from "lucide-react";

// Mock data for pending KYC verifications
// In a real app, this would come from the blockchain or a backend
const MOCK_KYC_REQUESTS = [
  { 
    id: "1", 
    userAddress: "0x3456789012345678901234567890123456789012", 
    documentType: "Aadhaar Card", 
    documentHash: "0x8a723aef5d7e86c65a3a321e7d77bc",
    submittedAt: "2025-04-08T10:30:00Z",
    status: "pending"
  },
  { 
    id: "2", 
    userAddress: "0x4567890123456789012345678901234567890123", 
    documentType: "PAN Card", 
    documentHash: "0x7b834dbf6e97d76b54b2430f8d88ac",
    submittedAt: "2025-04-07T15:45:00Z",
    status: "pending"
  },
  { 
    id: "3", 
    userAddress: "0x5678901234567890123456789012345678901234", 
    documentType: "Voter ID", 
    documentHash: "0x6c945ece7f08e87c65d3541e9e99bd",
    submittedAt: "2025-04-06T09:15:00Z",
    status: "pending"
  },
];

const VerifyKYCPage = () => {
  const { verifyKYC, isConnected } = useBlockchain();
  const [kycRequests, setKycRequests] = useState(MOCK_KYC_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  const handleVerify = async (userAddress: string, status: boolean) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsVerifying(true);
    try {
      await verifyKYC(userAddress, status);
      
      // Update local state to reflect the change
      setKycRequests(prevRequests => 
        prevRequests.map(req => 
          req.userAddress === userAddress 
            ? { ...req, status: status ? "approved" : "rejected" } 
            : req
        )
      );
      
      toast.success(`KYC ${status ? 'approved' : 'rejected'} for ${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`);
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Filter requests based on search term
  const filteredRequests = kycRequests.filter(req => 
    req.userAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.documentHash.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group requests by status
  const pendingRequests = filteredRequests.filter(req => req.status === "pending");
  const approvedRequests = filteredRequests.filter(req => req.status === "approved");
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
                placeholder="Search by address or document type..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Pending ({pendingRequests.length})</span>
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approved ({approvedRequests.length})</span>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <span>Rejected ({rejectedRequests.length})</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Pending Requests */}
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
                                className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                                onClick={() => handleVerify(request.userAddress, true)}
                                disabled={isVerifying || !isConnected}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                                onClick={() => handleVerify(request.userAddress, false)}
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
              
              {/* Approved Requests */}
              <TabsContent value="approved" className="mt-4">
                {approvedRequests.length > 0 ? (
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
                      {approvedRequests.map((request) => (
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
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Approved
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No approved KYC requests found
                  </div>
                )}
              </TabsContent>
              
              {/* Rejected Requests */}
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
      </div>
    </DashboardLayout>
  );
};

export default VerifyKYCPage;
