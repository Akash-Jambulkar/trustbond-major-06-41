
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loan, fetchBankLoans, getLoanStatistics } from "@/utils/loanHelpers";
import { formatDistanceToNow } from "date-fns";
import { CircleCheck, CircleDot, CircleX, Clock, Eye, Loader2 } from "lucide-react";

const BankLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLoans: 0,
    totalAmount: 0,
    averageInterestRate: 0,
    pendingLoans: 0,
    activeLoans: 0,
    completedLoans: 0
  });

  useEffect(() => {
    if (user && user.id) {
      loadLoans();
    }
  }, [user]);

  const loadLoans = async () => {
    setIsLoading(true);
    try {
      const bankLoans = await fetchBankLoans(user?.id || '');
      setLoans(bankLoans);
      setStats(getLoanStatistics(bankLoans));
    } catch (error) {
      console.error("Error loading loans:", error);
      toast.error("Failed to load loan data");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CircleCheck className="h-3 w-3" />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </Badge>
        );
      case "rejected":
      case "defaulted":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <CircleX className="h-3 w-3" />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <CircleDot className="h-3 w-3" />
            <span>Active</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Loan Management</h1>
      <p className="text-muted-foreground mb-6">Review and manage loan applications and active loans</p>
      
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLoans}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLoans}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLoans}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Loan Applications</CardTitle>
          <CardDescription>Manage customer loan applications and track active loans</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No loans found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Term (Months)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{loan.borrower?.name || "Unknown"}</div>
                        <div className="text-sm text-muted-foreground">{loan.borrower?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(Number(loan.amount))}</TableCell>
                    <TableCell>{loan.interest_rate}%</TableCell>
                    <TableCell>{loan.term_months}</TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                    <TableCell>
                      {loan.created_at ? formatDistanceToNow(new Date(loan.created_at), { addSuffix: true }) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BankLoans;
