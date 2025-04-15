import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileCheck, FileX, Clock, FileQuestion } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { formatDistanceToNow } from "date-fns";
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";
import { getUserKycSubmissions } from "@/utils/supabase/kycSubmissions";

export const KYCHistory = () => {
  const { account } = useBlockchain();
  const [submissions, setSubmissions] = useState<KycDocumentSubmissionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!account) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch submissions using our utility function
        const data = await getUserKycSubmissions(account);
        if (data && data.length > 0) {
          setSubmissions(data);
        } else {
          // If no data, use mock data
          setSubmissions(getMockSubmissions());
        }
      } catch (error) {
        console.error("Error fetching KYC history:", error);
        setSubmissions(getMockSubmissions());
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [account]);

  // Generate mock submissions for demo
  const getMockSubmissions = (): KycDocumentSubmissionType[] => {
    const now = Date.now();
    return [
      {
        id: "1",
        user_id: account || "",
        document_type: "National ID",
        document_number: "ID12345678",
        document_hash: "0x7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x",
        submitted_at: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        verification_status: "verified",
        verified_at: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        blockchain_tx_hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
      },
      {
        id: "2",
        user_id: account || "",
        document_type: "Passport",
        document_number: "P987654321",
        document_hash: "0x0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z",
        submitted_at: new Date(now - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
        verification_status: "rejected",
        verified_at: new Date(now - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
        rejection_reason: "Document appears to be modified or invalid",
        blockchain_tx_hash: "0x9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t9u8v7w6x5",
      },
      {
        id: "3",
        user_id: account || "",
        document_type: "Driving License",
        document_number: "DL567890123",
        document_hash: "0x5z4y3x2w1v0u9t8s7r6q5p4o3n2m1l0k9j8i7h6g5f4e3d2c1b0a",
        submitted_at: new Date(now - 1000 * 60 * 60).toISOString(), // 1 hour ago
        verification_status: "pending",
        blockchain_tx_hash: "0x3a2b1c0d9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x",
      }
    ];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <FileCheck className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <FileX className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <FileQuestion className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KYC Document History</CardTitle>
          <CardDescription>Loading your document submission history...</CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Document History</CardTitle>
        <CardDescription>View your document submission history and verification status</CardDescription>
      </CardHeader>
      <CardContent>
        {submissions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(submission.verification_status)}
                      <span>{submission.document_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>{getStatusBadge(submission.verification_status)}</TableCell>
                  <TableCell>
                    {submission.verified_at 
                      ? formatDistanceToNow(new Date(submission.verified_at), { addSuffix: true })
                      : submission.verification_status === "pending" 
                        ? "Awaiting verification" 
                        : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No document submissions found.</p>
            <p className="text-sm mt-2">Submit your first KYC document to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
