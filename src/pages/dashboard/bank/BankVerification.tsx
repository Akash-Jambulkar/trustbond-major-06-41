import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { LoanStatusEnum } from "@/types";
import { CheckCircle, XCircle, Clock, AlertTriangle, CreditCard } from "lucide-react";

const BankVerificationPage = () => {
  const { user } = useAuth();
  const { approveLoan, rejectLoan, submitLoanApplication } = useBlockchain();
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loanData, setLoanData] = useState({
    amount: 1000,
    interestRate: 5,
    termMonths: 12,
    purpose: "Business Expansion",
    bankId: user?.id || ''
  });

  const loadLoans = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockLoans = [
        {
          id: 1,
          borrower: "0xUser1",
          amount: 5000,
          interestRate: 7.5,
          termMonths: 24,
          purpose: "Home Improvement",
          status: LoanStatusEnum.UnderReview,
          appliedDate: "2024-01-20",
          approvalDate: null,
          fundingDate: null,
          repaymentDeadline: null,
          amountRepaid: 0,
        },
        {
          id: 2,
          borrower: "0xUser2",
          amount: 10000,
          interestRate: 6.0,
          termMonths: 36,
          purpose: "Debt Consolidation",
          status: LoanStatusEnum.Applied,
          appliedDate: "2024-02-15",
          approvalDate: null,
          fundingDate: null,
          repaymentDeadline: null,
          amountRepaid: 0,
        },
        {
          id: 3,
          borrower: "0xUser3",
          amount: 2500,
          interestRate: 8.0,
          termMonths: 12,
          purpose: "Car Purchase",
          status: LoanStatusEnum.Approved,
          appliedDate: "2024-03-01",
          approvalDate: "2024-03-05",
          fundingDate: null,
          repaymentDeadline: null,
          amountRepaid: 0,
        },
      ];

      setLoans(mockLoans);
    } catch (e: any) {
      setError(e.message || "Failed to load loans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLoanData({
      ...loanData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitLoan = async () => {
    setIsSubmitting(true);
    try {
      const loanId = await submitLoanApplication(loanData);
      if (loanId) {
        toast.success(`Loan application submitted successfully with ID: ${loanId}`);
        loadLoans();
      } else {
        toast.error("Failed to submit loan application");
      }
    } catch (e: any) {
      setError(e.message || "Failed to submit loan application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveLoan = async (loanId: number) => {
    try {
      const success = await approveLoan(loanId.toString());
      if (success) {
        loadLoans();
      }
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan");
    }
  };

  const handleRejectLoan = async (loanId: number) => {
    try {
      const reason = "Application does not meet our criteria";
      const success = await rejectLoan(loanId.toString(), reason);
      if (success) {
        loadLoans();
      }
    } catch (error) {
      console.error("Error rejecting loan:", error);
      toast.error("Failed to reject loan");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case LoanStatusEnum.Approved:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Approved</span>
          </Badge>
        );
      case LoanStatusEnum.Rejected:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      case LoanStatusEnum.Applied:
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Bank Verification Panel</h1>
        <p className="text-muted-foreground">
          Manage loan applications and verify user information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-trustbond-primary" />
              Submit Loan Application
            </CardTitle>
            <CardDescription>
              Submit a new loan application on behalf of a user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  value={loanData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter loan amount"
                />
              </div>
              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={loanData.interestRate}
                  onChange={handleInputChange}
                  placeholder="Enter interest rate"
                />
              </div>
              <div>
                <Label htmlFor="termMonths">Term Months</Label>
                <Input
                  type="number"
                  id="termMonths"
                  name="termMonths"
                  value={loanData.termMonths}
                  onChange={handleInputChange}
                  placeholder="Enter loan term (months)"
                />
              </div>
              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  type="text"
                  id="purpose"
                  name="purpose"
                  value={loanData.purpose}
                  onChange={handleInputChange}
                  placeholder="Enter loan purpose"
                />
              </div>
              <Button onClick={handleSubmitLoan} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Loan"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Applications</CardTitle>
            <CardDescription>
              Review and manage incoming loan applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Error loading data</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
            {isLoading ? (
              <div className="py-10 text-center">Loading loans...</div>
            ) : loans.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Term Months</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>{loan.borrower}</TableCell>
                      <TableCell>{loan.amount}</TableCell>
                      <TableCell>{loan.interestRate}</TableCell>
                      <TableCell>{loan.termMonths}</TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      <TableCell className="text-right">
                        {loan.status === LoanStatusEnum.Applied && (
                          <div className="space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleApproveLoan(loan.id)}>
                              Approve
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRejectLoan(loan.id)}>
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center">No loans found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankVerificationPage;
