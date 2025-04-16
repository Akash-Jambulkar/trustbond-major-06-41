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
          // No mock data - use empty array
          setSubmissions([]);
        }
      } catch (error) {
        console.error("Error fetching KYC history:", error);
        setSubmissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [account]);

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
