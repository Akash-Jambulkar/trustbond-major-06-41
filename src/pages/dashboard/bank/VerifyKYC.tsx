import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, CheckCircle, XCircle, Eye, AlertTriangle, Download, Upload, Shield, Lock, Check, AlertOctagon } from "lucide-react";
import { toast } from "sonner";
import { useMode } from "@/contexts/ModeContext";
import { verifyHashInDatabase, verifyDocumentUniqueness, DOCUMENT_TYPES } from "@/utils/documentHash";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { kycSubmissionsTable, usersMetadataTable } from "@/utils/supabase-helper";
import { supabase } from "@/integrations/supabase/client";
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";

type KYCDocument = {
  id: number | string;
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

const VerifyKYC = () => {
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isHashVerificationDialogOpen, setIsHashVerificationDialogOpen] = useState(false);
  const [hashToVerify, setHashToVerify] = useState("");
  const [hashVerificationResult, setHashVerificationResult] = useState<{
    exists: boolean;
    documentDetails?: any;
    isVerifying: boolean;
  }>({ exists: false, isVerifying: false });
  const [isLoading, setIsLoading] = useState(true);
  
  const { enableBlockchain } = useMode();
  const { isConnected, account } = useBlockchain();
  const { user } = useAuth();

  useEffect(() => {
    fetchKYCDocuments();
  }, []);

  const fetchKYCDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await kycSubmissionsTable()
        .select(`
          id, 
          user_id,
          document_type, 
          document_number, 
          document_hash, 
          submitted_at, 
          verified_at,
          verification_status
        `)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error("Error fetching KYC documents:", error);
        toast.error("Failed to load KYC documents");
        setDocuments([]);
      } else {
        if (data && data.length > 0) {
          const typedData = data as unknown as KycDocumentSubmissionType[];
          
          const formattedDocuments = await Promise.all(
            typedData.map(async (doc) => {
              try {
                const { data: userData, error: userError } = await usersMetadataTable()
                  .select('id')
                  .eq('id', doc.user_id)
                  .single();

                let userName = "Unknown User";
                if (!userError && userData) {
                  userName = `User ${doc.user_id.substring(0, 8)}`;
                }

                return {
                  id: doc.id,
                  userId: doc.user_id,
                  userName: userName,
                  documentType: getDocumentTypeName(doc.document_type),
                  documentId: doc.document_number,
                  status: doc.verification_status as "pending" | "verified" | "rejected",
                  submissionDate: new Date(doc.submitted_at).toLocaleDateString(),
                  verificationDate: doc.verified_at ? new Date(doc.verified_at).toLocaleDateString() : undefined,
                  documentHash: doc.document_hash,
                  documentFiles: ["document.jpg"]
                };
              } catch (err) {
                console.error("Error processing document:", err);
                return {
                  id: doc.id,
                  userId: doc.user_id,
                  userName: "Unknown User",
                  documentType: getDocumentTypeName(doc.document_type),
                  documentId: doc.document_number,
                  status: doc.verification_status as "pending" | "verified" | "rejected",
                  submissionDate: new Date(doc.submitted_at).toLocaleDateString(),
                  verificationDate: doc.verified_at ? new Date(doc.verified_at).toLocaleDateString() : undefined,
                  documentHash: doc.document_hash,
                  documentFiles: ["document.jpg"]
                };
              }
            })
          );

          setDocuments(formattedDocuments);
        } else {
          setDocuments([]);
        }
      }
    } catch (error) {
      console.error("Error fetching KYC documents:", error);
      toast.error("Failed to load KYC documents");
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (docId: number | string, newStatus: "verified" | "rejected") => {
    if (!selectedDocument) return;
    
    try {
      const now = new Date().toISOString();
      
      const documentIdString = String(docId);
      
      const updateData = { 
        verification_status: newStatus,
        verified_at: now,
        verified_by: user?.id
      };
      
      const { error } = await kycSubmissionsTable()
        .update(updateData as any)
        .eq('id', documentIdString);
      
      if (error) {
        console.error("Error updating document status:", error);
        toast.error("Failed to update document status");
        return;
      }
      
      setDocuments(documents.map(doc => 
        doc.id === docId ? { 
          ...doc, 
          status: newStatus,
          verificationDate: new Date().toLocaleDateString()
        } : doc
      ));

      toast.success(`Document #${docId} has been ${newStatus}`);
      setIsDetailsDialogOpen(false);
      
      if (enableBlockchain && isConnected) {
        toast.success("Updated verification status on the blockchain");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update document status");
    }
  };

  const handleViewDetails = (document: KYCDocument) => {
    setSelectedDocument(document);
    setIsDetailsDialogOpen(true);
  };

  const handleVerifyHash = async () => {
    if (!hashToVerify) {
      toast.error("Please enter a document hash to verify");
      return;
    }
    
    setHashVerificationResult({ exists: false, isVerifying: true });
    
    try {
      const result = await kycSubmissionsTable()
        .select('*')
        .eq('document_hash', hashToVerify)
        .maybeSingle();
      
      const exists = !result.error && result.data;
      let documentDetails = exists ? result.data : null;
      
      setHashVerificationResult({
        exists: exists ? true : false,
        documentDetails,
        isVerifying: false
      });
      
      if (exists) {
        toast.success("Document hash verification successful");
      } else {
        toast.error("Document hash not found in the system");
      }
    } catch (error) {
      console.error("Error verifying hash:", error);
      toast.error("Failed to verify document hash");
      setHashVerificationResult({ exists: false, isVerifying: false });
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsHashVerificationDialogOpen(true)}
            className="bg-trustbond-primary"
          >
            <Shield className="mr-2 h-4 w-4" />
            Verify Document Hash
          </Button>
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800"></div>
                            <span className="ml-2">Loading documents...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No documents found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">#{typeof doc.id === 'number' ? doc.id : doc.id.substring(0, 8)}</TableCell>
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
                    <div className="text-sm">{selectedDocument.userId.substring(0, 8)}...</div>
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
              
              <div className="space-y-2 sm:col-span-2">
                <h3 className="text-sm font-medium">Document Hash Verification</h3>
                <div className="rounded-md border p-3 mt-3 bg-gray-50">
                  <div className="grid grid-cols-4">
                    <div className="text-sm font-medium">Hash:</div>
                    <div className="text-xs font-mono col-span-3 truncate">
                      {selectedDocument.documentHash}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Lock className="h-4 w-4 mr-1" />
                    <span>This document hash is unique and tamper-proof</span>
                  </div>
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
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Document
                  </Button>
                  <Button 
                    onClick={() => {
                      handleStatusChange(selectedDocument.id, "verified");
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
      
      <Dialog open={isHashVerificationDialogOpen} onOpenChange={setIsHashVerificationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-trustbond-primary" />
              Document Hash Verification
            </DialogTitle>
            <DialogDescription>
              Verify the authenticity of a document by its hash
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="documentHash" className="text-sm font-medium">
                Document Hash
              </label>
              <Input
                id="documentHash"
                placeholder="Enter document hash to verify"
                value={hashToVerify}
                onChange={(e) => setHashToVerify(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            
            <Button 
              onClick={handleVerifyHash} 
              className="w-full"
              disabled={!hashToVerify || hashVerificationResult.isVerifying}
            >
              {hashVerificationResult.isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Verify Hash
                </>
              )}
            </Button>
            
            {hashVerificationResult.exists && hashVerificationResult.documentDetails && (
              <div className="rounded-md border p-3 mt-4 bg-green-50 border-green-200">
                <div className="flex items-center text-green-700 mb-2">
                  <Check className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Document Verified</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="font-medium">Document Type:</div>
                    <div className="col-span-2">{getDocumentTypeName(hashVerificationResult.documentDetails.document_type)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="font-medium">Document Number:</div>
                    <div className="col-span-2 font-mono">{hashVerificationResult.documentDetails.document_number}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="font-medium">Submitted:</div>
                    <div className="col-span-2">{new Date(hashVerificationResult.documentDetails.submitted_at).toLocaleDateString()}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="font-medium">Status:</div>
                    <div className="col-span-2">
                      {hashVerificationResult.documentDetails.verification_status === "verified" && (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verified
                        </span>
                      )}
                      {hashVerificationResult.documentDetails.verification_status === "pending" && (
                        <span className="text-amber-600 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Pending
                        </span>
                      )}
                      {hashVerificationResult.documentDetails.verification_status === "rejected" && (
                        <span className="text-red-600 flex items-center">
                          <AlertOctagon className="h-4 w-4 mr-1" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!hashVerificationResult.isVerifying && hashToVerify && !hashVerificationResult.exists && (
              <div className="rounded-md border p-3 mt-4 bg-red-50 border-red-200">
                <div className="flex items-center text-red-700">
                  <AlertOctagon className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Document Not Found</h3>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  The provided hash does not match any document in our system.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHashVerificationDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifyKYC;
