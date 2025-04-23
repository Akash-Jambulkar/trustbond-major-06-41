import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { CheckCircle, XCircle, FileText, Shield, AlertTriangle, Eye } from "lucide-react";
import { format } from "date-fns";

const VerifyKYC = () => {
  const { user } = useAuth();
  const { verifyKYC, isConnected } = useBlockchain();
  const [documents, setDocuments] = useState<any[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);
  const [verifiedDocuments, setVerifiedDocuments] = useState<any[]>([]);
  const [rejectedDocuments, setRejectedDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const { account } = useAuth();

  useEffect(() => {
    if (user && user.role === "bank") {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("kyc_documents")
        .select("*, profiles(name, email, wallet_address)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
      setPendingDocuments(data?.filter(doc => doc.verification_status === "pending") || []);
      setVerifiedDocuments(data?.filter(doc => doc.verification_status === "verified") || []);
      setRejectedDocuments(data?.filter(doc => doc.verification_status === "rejected") || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDocument = async (approve: boolean) => {
    try {
      setVerifying(true);
      
      if (!selectedDocument || !selectedDocument.profiles?.wallet_address) {
        toast.error("No wallet address found for user");
        setVerifying(false);
        return;
      }
      
      const verificationStatus = approve ? 'verified' as const : 'rejected' as const;
      
      await verifyKYC(selectedDocument.profiles.wallet_address, approve);
      
      const { error } = await supabase
        .from('kyc_documents')
        .update({ 
          verification_status: verificationStatus,
          verified_by: account,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedDocument.id);
        
      if (error) throw error;
      
      toast.success(`Document ${approve ? 'verified' : 'rejected'} successfully`);
      setSelectedDocument(null);
      fetchDocuments();
    } catch (error) {
      toast.error("Error verifying document");
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Verified</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
    }
  };

  const DocumentTable = ({ documents, showActions = false }: { documents: any[], showActions?: boolean }) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No documents found
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Document Type</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{doc.profiles?.name || "Unknown"}</div>
                  <div className="text-sm text-muted-foreground">{doc.profiles?.email}</div>
                </div>
              </TableCell>
              <TableCell>{doc.document_type}</TableCell>
              <TableCell>{formatDate(doc.created_at)}</TableCell>
              <TableCell>{getStatusBadge(doc.verification_status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (!user || user.role !== "bank") {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10">
              <Shield className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-center mb-2">Unauthorized Access</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                You need bank privileges to access this page
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10">
              <Shield className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-center mb-2">Wallet Not Connected</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Please connect your wallet to verify KYC documents
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">KYC Verification</h1>
        <p className="text-muted-foreground">
          Review and verify customer KYC documents
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-trustbond-primary" />
            Document Verification
          </CardTitle>
          <CardDescription>
            Verify customer identity documents and update their KYC status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                Pending
                {pendingDocuments.length > 0 && (
                  <Badge className="ml-2 bg-amber-500">{pendingDocuments.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <DocumentTable documents={pendingDocuments} showActions={true} />
            </TabsContent>
            <TabsContent value="verified">
              <DocumentTable documents={verifiedDocuments} />
            </TabsContent>
            <TabsContent value="rejected">
              <DocumentTable documents={rejectedDocuments} />
            </TabsContent>
            <TabsContent value="all">
              <DocumentTable documents={documents} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Document Verification Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify KYC Document</DialogTitle>
            <DialogDescription>
              Review the document details before verification
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">User</p>
                  <p className="text-sm">{selectedDocument.profiles?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Email</p>
                  <p className="text-sm">{selectedDocument.profiles?.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Wallet Address</p>
                <p className="text-sm font-mono text-xs break-all">
                  {selectedDocument.profiles?.wallet_address || "Not provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Document Type</p>
                  <p className="text-sm">{selectedDocument.document_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Submitted Date</p>
                  <p className="text-sm">{formatDate(selectedDocument.created_at)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Document Hash</p>
                <p className="text-sm font-mono text-xs break-all">
                  {selectedDocument.document_hash}
                </p>
              </div>

              <div className="rounded-md bg-amber-50 p-3">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Verification Notice</p>
                    <p className="text-sm text-amber-700 mt-1">
                      By verifying this document, you confirm that you have reviewed the customer's
                      identity information and found it to be accurate and authentic.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            {selectedDocument && selectedDocument.verification_status === "pending" ? (
              <>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={verifying}
                  onClick={() => handleVerifyDocument(false)}
                  className="mb-2 sm:mb-0"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  type="button"
                  disabled={verifying}
                  onClick={() => handleVerifyDocument(true)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setSelectedDocument(null)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerifyKYC;
