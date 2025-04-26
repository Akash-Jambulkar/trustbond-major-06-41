
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  UserCheck, 
  Clock, 
  FileText,
  RefreshCw,
  User
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { supabase } from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";

interface KYCSubmission {
  id: string;
  user_id: string;
  document_hash: string;
  document_type: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  submitted_at: string;
  verified_at: string | null;
  rejection_reason: string | null;
  blockchain_tx_hash: string | null;
  verification_tx_hash: string | null;
  verifier_address: string | null;
  wallet_address: string | null;
  user_details?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export default function VerifyKYC() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const { toast } = useToast();
  const { verifyKYC, isConnected, account } = useBlockchain();

  // Fetch KYC submissions
  const fetchKYCSubmissions = async () => {
    setIsLoading(true);
    console.log("Fetching KYC submissions...");
    
    try {
      // Fetch KYC submissions first
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('kyc_document_submissions')
        .select('*');

      if (submissionsError) {
        console.error("Error fetching submissions:", submissionsError);
        throw submissionsError;
      }

      // Then fetch user details for each submission
      const submissionsWithUserDetails = await Promise.all(
        (submissionsData || []).map(async (submission) => {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .eq('id', submission.user_id)
            .single();

          if (userError) {
            console.warn("Error fetching user details for submission:", userError);
            // Return submission without user details if there's an error
            return { ...submission, user_details: undefined };
          }

          return { ...submission, user_details: userData };
        })
      );

      console.log("Formatted submissions:", submissionsWithUserDetails);
      setSubmissions(submissionsWithUserDetails);
    } catch (error) {
      console.error("Error fetching KYC submissions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load KYC submissions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCSubmissions();
  }, []);

  // Filter submissions based on active tab
  const filteredSubmissions = submissions.filter(submission => {
    switch (activeTab) {
      case "pending":
        return submission.verification_status === "pending";
      case "verified":
        return submission.verification_status === "verified";
      case "rejected":
        return submission.verification_status === "rejected";
      default:
        return true;
    }
  });

  // Handle verification of a KYC submission
  const handleVerify = async (submission: KYCSubmission) => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Not connected",
        description: "Please connect your wallet to verify KYC submissions.",
      });
      return;
    }

    try {
      // First update the verification status in the database
      const { error: updateError } = await supabase
        .from('kyc_document_submissions')
        .update({
          verification_status: 'verified',
          verified_at: new Date().toISOString(),
          verifier_address: account
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      // If blockchain verification is available, use it
      if (verifyKYC && isConnected) {
        const result = await verifyKYC(submission.document_hash);
        
        // Record the blockchain transaction
        if (result && result.transactionHash) {
          const { error: txError } = await supabase
            .from('transactions')
            .insert({
              transaction_hash: result.transactionHash,
              transaction_type: 'kyc_verification',
              user_id: submission.user_id,
              related_entity_id: submission.id,
              status: 'completed',
              from_address: account,
              blockchain_timestamp: new Date().toISOString()
            });

          if (txError) {
            console.error("Error recording transaction:", txError);
            // Continue even if transaction recording fails
          }

          // Update the verification transaction hash
          const { error: updateHashError } = await supabase
            .from('kyc_document_submissions')
            .update({ verification_tx_hash: result.transactionHash })
            .eq('id', submission.id);

          if (updateHashError) {
            console.error("Error updating verification hash:", updateHashError);
          }
        }
      }

      toast({
        title: "Verification successful",
        description: "The KYC document has been verified.",
      });

      // Refresh the submissions list
      fetchKYCSubmissions();

    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "There was an error verifying the KYC document.",
      });
    }
  };

  // Handle rejection of a KYC submission
  const handleReject = async (submission: KYCSubmission, reason: string = "Document does not meet requirements") => {
    try {
      const { error } = await supabase
        .from('kyc_document_submissions')
        .update({
          verification_status: 'rejected',
          rejection_reason: reason,
          verified_at: new Date().toISOString(),
          verifier_address: account
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast({
        title: "Rejection successful",
        description: "The KYC document has been rejected.",
      });

      // Refresh the submissions list
      fetchKYCSubmissions();

    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast({
        variant: "destructive",
        title: "Rejection failed",
        description: "There was an error rejecting the KYC document.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">
          Verify and approve KYC document submissions from users
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-trustbond-primary" />
                Document Verification
              </CardTitle>
              <CardDescription>
                Review and verify user identity documents
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={() => fetchKYCSubmissions()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs 
            defaultValue="pending" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Pending</span>
                {submissions.filter(s => s.verification_status === "pending").length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {submissions.filter(s => s.verification_status === "pending").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="verified" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Verified</span>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                <span>Rejected</span>
              </TabsTrigger>
            </TabsList>

            {Object.values(["pending", "verified", "rejected"]).map((status) => (
              <TabsContent value={status} key={status} className="mt-0">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <RefreshCw className="h-8 w-8 animate-spin text-trustbond-primary" />
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <Alert className="bg-muted">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No {status} submissions</AlertTitle>
                    <AlertDescription>
                      {status === "pending" 
                        ? "No pending KYC submissions to verify." 
                        : status === "verified"
                          ? "No verified KYC submissions yet."
                          : "No rejected KYC submissions."
                      }
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Document Type</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Hash</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {submission.user_details ? (
                                <div>
                                  <div>{submission.user_details.full_name || 'Unknown User'}</div>
                                  <div className="text-xs text-muted-foreground">{submission.user_details.email}</div>
                                </div>
                              ) : (
                                <div>
                                  <div>User ID: {submission.user_id.slice(0, 8)}...</div>
                                  <div className="text-xs text-muted-foreground">User details unavailable</div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              <FileText className="h-3 w-3 mr-1" />
                              {submission.document_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs">
                              {submission.document_hash.substring(0, 6)}...
                              {submission.document_hash.substring(submission.document_hash.length - 4)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {submission.verification_status === "pending" && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            {submission.verification_status === "verified" && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {submission.verification_status === "rejected" && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="h-3 w-3 mr-1" />
                                Rejected
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {submission.verification_status === "pending" && (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleVerify(submission)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Verify
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject(submission)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {submission.verification_status === "verified" && (
                              <div className="flex items-center justify-end gap-2 text-xs">
                                <UserCheck className="h-4 w-4 text-green-500" />
                                <span>
                                  {submission.verifier_address ? (
                                    <>By: {submission.verifier_address.substring(0, 6)}...</>
                                  ) : (
                                    <>Verified</>
                                  )}
                                </span>
                              </div>
                            )}
                            {submission.verification_status === "rejected" && (
                              <div className="flex items-center justify-end gap-2 text-xs">
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span>
                                  {submission.rejection_reason || "Rejected"}
                                </span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>

        <CardFooter className="bg-muted/50 flex flex-col items-start text-xs text-muted-foreground">
          <div className="flex gap-2 items-center mb-1">
            <Shield className="h-4 w-4 text-trustbond-primary" />
            <span>
              All verification actions are recorded on the blockchain for transparency and audit purposes.
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
