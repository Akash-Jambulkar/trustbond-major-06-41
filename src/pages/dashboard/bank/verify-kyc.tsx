
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
import { CheckCircle, XCircle, Shield, AlertTriangle, Eye, Loader2, RefreshCw } from "lucide-react";
import { format } from "date-fns";

const VerifyKYC = () => {
  const { user } = useAuth();
  const { verifyKYC, isConnected, account } = useBlockchain();
  const [documents, setDocuments] = useState<any[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);
  const [verifiedDocuments, setVerifiedDocuments] = useState<any[]>([]);
  const [rejectedDocuments, setRejectedDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (user && user.role === "bank") {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      // Fetch all KYC submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('kyc_document_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (submissionsError) {
        console.error("Error fetching KYC submissions:", submissionsError);
        throw submissionsError;
      }
      
      // Enhance submissions with profile data through separate queries
      const enhancedSubmissions = await Promise.all((submissions || []).map(async (doc) => {
        // Get profile info for each submission's user_id
        if (doc.user_id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('name, email, wallet_address')
            .eq('id', doc.user_id)
            .maybeSingle();
          
          if (!profileError && profileData) {
            return {
              ...doc,
              user_info: {
                name: profileData.name || 'Unknown',
                email: profileData.email || 'No email',
                wallet_address: profileData.wallet_address || doc.wallet_address || null
              }
            };
          }
        }
        
        return {
          ...doc,
          user_info: { 
            name: "Unknown", 
            email: "No email", 
            wallet_address: doc.wallet_address || null 
          }
        };
      }));
      
      console.log("Fetched and enhanced KYC submissions:", enhancedSubmissions);
      
      setDocuments(enhancedSubmissions);
      setPendingDocuments(enhancedSubmissions.filter(doc => doc.verification_status === "pending"));
      setVerifiedDocuments(enhancedSubmissions.filter(doc => doc.verification_status === "verified"));
      setRejectedDocuments(enhancedSubmissions.filter(doc => doc.verification_status === "rejected"));
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch KYC submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDocument = async (approve: boolean) => {
    try {
      setVerifying(true);
      
      if (!selectedDocument || !selectedDocument.id) {
        toast.error("No document ID found");
        setVerifying(false);
        return;
      }
      
      const verificationStatus = approve ? 'verified' as const : 'rejected' as const;
      
      // Try blockchain verification if available
      if (verifyKYC) {
        try {
          await verifyKYC(selectedDocument.id, verificationStatus);
        } catch (error) {
          console.error("Blockchain verification failed, continuing with database update:", error);
        }
      }

      // Always update database record
      const { data: updateResult, error: updateError } = await supabase
        .from('kyc_document_submissions')
        .update({ 
          verification_status: verificationStatus,
          verified_at: new Date().toISOString(),
          verifier_address: account,
          rejection_reason: !approve ? "Document verification failed" : null
        })
        .eq('id', selectedDocument.id)
        .select();
        
      if (updateError) {
        throw updateError;
      }
      
      // Update user profile KYC status
      if (selectedDocument.user_id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            kyc_status: verificationStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedDocument.user_id);
          
        if (profileError) {
          console.error("Error updating profile KYC status:", profileError);
        }
      }
      
      toast.success(`Document ${approve ? 'verified' : 'rejected'} successfully`);
      setSelectedDocument(null);
      fetchDocuments();
    } catch (error) {
      console.error("Error verifying document:", error);
      toast.error("Error verifying document");
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return "Invalid date";
    }
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

  const DocumentTable = ({ documents }: { documents: any[] }) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                  <div className="font-medium">{doc.user_info?.name || "Unknown"}</div>
                  <div className="text-sm text-muted-foreground">{doc.user_info?.email}</div>
                </div>
              </TableCell>
              <TableCell>{doc.document_type}</TableCell>
              <TableCell>{formatDate(doc.submitted_at)}</TableCell>
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">KYC Verification</h1>
        <p className="text-muted-foreground">
          Review and verify customer KYC documents
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Document Verification
            </CardTitle>
            <CardDescription>
              Verify customer identity documents and update their KYC status
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchDocuments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
              <DocumentTable documents={pendingDocuments} />
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
                  <p className="text-sm">{selectedDocument.user_info?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Email</p>
                  <p className="text-sm">{selectedDocument.user_info?.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Wallet Address</p>
                <p className="text-sm font-mono text-xs break-all">
                  {selectedDocument.user_info?.wallet_address || selectedDocument.wallet_address || "Not provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Document Type</p>
                  <p className="text-sm">{selectedDocument.document_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Submitted Date</p>
                  <p className="text-sm">{formatDate(selectedDocument.submitted_at)}</p>
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
