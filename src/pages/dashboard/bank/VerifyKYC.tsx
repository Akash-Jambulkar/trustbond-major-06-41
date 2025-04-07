
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, CheckCircle, XCircle, Eye, AlertTriangle, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { useMode } from "@/contexts/ModeContext";

// KYC document type definition
type KYCDocument = {
  id: number;
  userId: string;
  userName: string;
  documentType: string;
  documentId: string;
  status: "pending" | "verified" | "rejected";
  submissionDate: string;
  verificationDate?: string;
  documentHash?: string;
  documentFiles: string[];
};

// Mock KYC document data
const mockKYCDocuments: KYCDocument[] = [
  {
    id: 1,
    userId: "USR-001",
    userName: "John Doe",
    documentType: "Aadhar Card",
    documentId: "XXXX-XXXX-1234",
    status: "pending",
    submissionDate: "2025-03-25",
    documentHash: "0x2a55c7ede6f599d1f7c62efd9b5f6d52c42a979fc26a0355fac6b539b1225539",
    documentFiles: ["aadhar_front.jpg", "aadhar_back.jpg"]
  },
  {
    id: 2,
    userId: "USR-002",
    userName: "Jane Smith",
    documentType: "PAN Card",
    documentId: "ABCDE1234F",
    status: "verified",
    submissionDate: "2025-03-20",
    verificationDate: "2025-03-22",
    documentHash: "0x3b66c7ede6f599d1f7c62efd9b5f6d52c42a979fc26a0355fac6b539b1225539",
    documentFiles: ["pan_card.jpg"]
  },
  {
    id: 3,
    userId: "USR-003",
    userName: "Robert Johnson",
    documentType: "Passport",
    documentId: "J1234567",
    status: "pending",
    submissionDate: "2025-03-15",
    documentHash: "0x4c77c7ede6f599d1f7c62efd9b5f6d52c42a979fc26a0355fac6b539b1225539",
    documentFiles: ["passport_front.jpg", "passport_back.jpg"]
  },
  {
    id: 4,
    userId: "USR-004",
    userName: "Sarah Wilson",
    documentType: "Voter ID",
    documentId: "TN/12/345/678901",
    status: "rejected",
    submissionDate: "2025-03-10",
    verificationDate: "2025-03-12",
    documentFiles: ["voter_id.jpg"]
  },
  {
    id: 5,
    userId: "USR-005",
    userName: "Michael Brown",
    documentType: "Driving License",
    documentId: "MH-0123456789",
    status: "pending",
    submissionDate: "2025-03-05",
    documentHash: "0x5d88c7ede6f599d1f7c62efd9b5f6d52c42a979fc26a0355fac6b539b1225539",
    documentFiles: ["driving_license.jpg"]
  }
];

const VerifyKYC = () => {
  const [documents, setDocuments] = useState<KYCDocument[]>(mockKYCDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { enableBlockchain } = useMode();

  // Filter documents based on search
  const filteredDocuments = documents.filter(doc => 
    doc.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (docId: number, newStatus: "verified" | "rejected") => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { 
        ...doc, 
        status: newStatus,
        verificationDate: new Date().toISOString().split('T')[0]
      } : doc
    ));

    toast.success(`Document #${docId} has been ${newStatus}`);
  };

  const handleViewDetails = (document: KYCDocument) => {
    setSelectedDocument(document);
    setIsDetailsDialogOpen(true);
  };

  const renderBlockchainVerification = () => {
    if (!enableBlockchain || !selectedDocument?.documentHash) return null;
    
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Blockchain Verification</h3>
        <div className="rounded-md border p-3 space-y-2">
          <div className="grid grid-cols-4">
            <div className="text-sm font-medium">Document Hash:</div>
            <div className="text-xs font-mono col-span-3 truncate">
              {selectedDocument.documentHash}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Verify on Blockchain:</div>
            <Button variant="outline" size="sm" onClick={() => toast.success("Verified document hash on blockchain")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify Hash
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
        <div className="flex gap-2">
          {enableBlockchain && (
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Blockchain Verification
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="pending">Pending ({documents.filter(d => d.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({documents.filter(d => d.status === "verified").length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KYC Documents</CardTitle>
              <CardDescription>Verify user identity documents</CardDescription>
              <div className="relative sm:max-w-xs mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User Name</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Document ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No documents found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">#{doc.id}</TableCell>
                          <TableCell>{doc.userName}</TableCell>
                          <TableCell>{doc.documentType}</TableCell>
                          <TableCell className="font-mono text-xs">{doc.documentId}</TableCell>
                          <TableCell>
                            {doc.status === "pending" && (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            )}
                            {doc.status === "verified" && (
                              <Badge className="bg-green-100 text-green-800">Verified</Badge>
                            )}
                            {doc.status === "rejected" && (
                              <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>
                            )}
                          </TableCell>
                          <TableCell>{doc.submissionDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(doc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {doc.status === "pending" && (
                                <>
                                  <Button 
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleStatusChange(doc.id, "verified")}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleStatusChange(doc.id, "rejected")}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Documents</CardTitle>
              <CardDescription>Documents awaiting verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Document ID</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.filter(d => d.status === "pending").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No pending documents.
                        </TableCell>
                      </TableRow>
                    ) : (
                      documents.filter(d => d.status === "pending").map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.userName}</TableCell>
                          <TableCell>{doc.documentType}</TableCell>
                          <TableCell className="font-mono text-xs">{doc.documentId}</TableCell>
                          <TableCell>{doc.submissionDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(doc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusChange(doc.id, "verified")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleStatusChange(doc.id, "rejected")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verified" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verified Documents</CardTitle>
              <CardDescription>Successfully verified documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Document ID</TableHead>
                      <TableHead>Verification Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.filter(d => d.status === "verified").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No verified documents.
                        </TableCell>
                      </TableRow>
                    ) : (
                      documents.filter(d => d.status === "verified").map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.userName}</TableCell>
                          <TableCell>{doc.documentType}</TableCell>
                          <TableCell className="font-mono text-xs">{doc.documentId}</TableCell>
                          <TableCell>{doc.verificationDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(doc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Document Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              Review and verify KYC document
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">User Information</h3>
                <div className="rounded-md border p-3 space-y-2">
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Name:</div>
                    <div className="text-sm">{selectedDocument.userName}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">User ID:</div>
                    <div className="text-sm">{selectedDocument.userId}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Document Information</h3>
                <div className="rounded-md border p-3 space-y-2">
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Type:</div>
                    <div className="text-sm">{selectedDocument.documentType}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Document ID:</div>
                    <div className="text-sm font-mono">{selectedDocument.documentId}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Submission:</div>
                    <div className="text-sm">{selectedDocument.submissionDate}</div>
                  </div>
                  {selectedDocument.verificationDate && (
                    <div className="grid grid-cols-2">
                      <div className="text-sm font-medium">Verified:</div>
                      <div className="text-sm">{selectedDocument.verificationDate}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <h3 className="text-sm font-medium">Document Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDocument.documentFiles.map((file, index) => (
                    <div key={index} className="border rounded-md p-2">
                      <div className="bg-gray-100 h-40 flex items-center justify-center rounded-md mb-2">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate">{file}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {renderBlockchainVerification()}
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <div className="flex gap-2">
              {selectedDocument && selectedDocument.status === "pending" && (
                <>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleStatusChange(selectedDocument.id, "rejected");
                      setIsDetailsDialogOpen(false);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Document
                  </Button>
                  <Button 
                    onClick={() => {
                      handleStatusChange(selectedDocument.id, "verified");
                      setIsDetailsDialogOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify Document
                  </Button>
                </>
              )}
              {selectedDocument && selectedDocument.status === "rejected" && (
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    handleStatusChange(selectedDocument.id, "verified");
                    setIsDetailsDialogOpen(false);
                  }}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Change to Verified
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifyKYC;
