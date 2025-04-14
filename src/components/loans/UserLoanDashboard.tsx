
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Wallet, 
  ArrowUpCircle, 
  BadgeDollarSign,
  PieChart as PieChartIcon,
  TrendingUp,
  Plus
} from "lucide-react";

// Types
type LoanStatus = "active" | "completed" | "pending" | "rejected";

interface Loan {
  id: string;
  amount: number;
  purpose: string;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  remainingAmount: number;
  nextPaymentDate: string;
  startDate: string;
  endDate: string;
  status: LoanStatus;
  bank: string;
  paidMonths: number;
  totalMonths: number;
}

interface PaymentHistory {
  date: string;
  amount: number;
  status: "completed" | "pending" | "failed";
}

// Sample data
const mockLoans: Loan[] = [
  {
    id: "loan-1",
    amount: 50000,
    purpose: "Home Renovation",
    interestRate: 8.5,
    term: 12,
    monthlyPayment: 4375,
    remainingAmount: 35000,
    nextPaymentDate: "2023-12-25",
    startDate: "2023-06-15",
    endDate: "2024-06-15",
    status: "active",
    bank: "Global Bank",
    paidMonths: 4,
    totalMonths: 12
  },
  {
    id: "loan-2",
    amount: 20000,
    purpose: "Education",
    interestRate: 7.2,
    term: 24,
    monthlyPayment: 900,
    remainingAmount: 20000,
    nextPaymentDate: "2023-12-30",
    startDate: "2023-11-30",
    endDate: "2025-11-30",
    status: "pending",
    bank: "Trust Finance",
    paidMonths: 0,
    totalMonths: 24
  },
  {
    id: "loan-3",
    amount: 10000,
    purpose: "Medical Expenses",
    interestRate: 6.5,
    term: 6,
    monthlyPayment: 1700,
    remainingAmount: 0,
    nextPaymentDate: "",
    startDate: "2023-01-10",
    endDate: "2023-07-10",
    status: "completed",
    bank: "Health Credit Union",
    paidMonths: 6,
    totalMonths: 6
  }
];

const paymentHistoryData: PaymentHistory[] = [
  { date: "2023-11-25", amount: 4375, status: "completed" },
  { date: "2023-10-25", amount: 4375, status: "completed" },
  { date: "2023-09-25", amount: 4375, status: "completed" },
  { date: "2023-08-25", amount: 4375, status: "completed" },
];

const monthlyPaymentData = [
  { month: 'Jun', payment: 4375 },
  { month: 'Jul', payment: 4375 },
  { month: 'Aug', payment: 4375 },
  { month: 'Sep', payment: 4375 },
  { month: 'Oct', payment: 4375 },
  { month: 'Nov', payment: 4375 },
  { month: 'Dec', payment: 4375 },
];

const loanBreakdownData = [
  { name: 'Principal', value: 50000 },
  { name: 'Interest', value: 2500 },
];

const COLORS = ['#4f46e5', '#f97316'];

export function UserLoanDashboard() {
  const { user } = useAuth();
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]);
  const [completedLoans, setCompletedLoans] = useState<Loan[]>([]);
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);

  // Initialize with mock data
  useEffect(() => {
    const active = mockLoans.filter(loan => loan.status === "active");
    const pending = mockLoans.filter(loan => loan.status === "pending");
    const completed = mockLoans.filter(loan => loan.status === "completed");
    
    setActiveLoans(active);
    setPendingLoans(pending);
    setCompletedLoans(completed);
    
    // Set the first active loan as default
    if (active.length > 0) {
      setActiveLoan(active[0]);
    }
  }, []);

  // Calculate loan statistics
  const totalActiveAmount = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalRemainingAmount = activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalPendingAmount = pendingLoans.reduce((sum, loan) => sum + loan.amount, 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get loan status badge
  const getLoanStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loan Dashboard</h1>
        <Button asChild>
          <Link to="/dashboard/user/loan-application" className="flex items-center gap-1">
            <Plus size={16} /> Apply for New Loan
          </Link>
        </Button>
      </div>
      
      {/* Loan Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{activeLoans.length}</div>
                <p className="text-xs text-muted-foreground">Total Value: {formatCurrency(totalActiveAmount)}</p>
              </div>
              <CreditCard className="h-6 w-6 text-trustbond-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{pendingLoans.length}</div>
                <p className="text-xs text-muted-foreground">Total Value: {formatCurrency(totalPendingAmount)}</p>
              </div>
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{completedLoans.length}</div>
                <p className="text-xs text-muted-foreground">Excellent repayment history</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Loan Information */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Loans</TabsTrigger>
          <TabsTrigger value="pending">Pending Applications</TabsTrigger>
          <TabsTrigger value="completed">Completed Loans</TabsTrigger>
        </TabsList>
        
        {/* Active Loans Tab */}
        <TabsContent value="active" className="space-y-4">
          {activeLoans.length > 0 ? (
            <>
              {/* Active Loan Cards */}
              <div className="grid grid-cols-1 gap-4">
                {activeLoans.map(loan => (
                  <Card key={loan.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Loan Details */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{loan.purpose}</h3>
                            <p className="text-sm text-muted-foreground">{loan.bank}</p>
                          </div>
                          {getLoanStatusBadge(loan.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Loan Amount</p>
                            <p className="font-semibold">{formatCurrency(loan.amount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Interest Rate</p>
                            <p className="font-semibold">{loan.interestRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Payment</p>
                            <p className="font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Next Payment</p>
                            <p className="font-semibold">{formatDate(loan.nextPaymentDate)}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Repayment Progress</span>
                            <span>{loan.paidMonths} of {loan.totalMonths} months</span>
                          </div>
                          <Progress value={(loan.paidMonths / loan.totalMonths) * 100} />
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="bg-muted p-6 md:w-64 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold mb-2">Remaining Balance</h4>
                          <p className="text-2xl font-bold text-trustbond-primary">
                            {formatCurrency(loan.remainingAmount)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Out of {formatCurrency(loan.amount)}
                          </p>
                        </div>
                        <div className="space-y-2 mt-4">
                          <Button className="w-full">Make Payment</Button>
                          <Button variant="outline" asChild className="w-full">
                            <Link to={`/dashboard/user/loans/${loan.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Loan Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Payment History Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md flex items-center gap-2">
                      <TrendingUp size={16} />
                      Payment History
                    </CardTitle>
                    <CardDescription>
                      Your monthly payment history for active loans
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyPaymentData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="payment" 
                          stroke="#4f46e5" 
                          activeDot={{ r: 8 }} 
                          name="Payment" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Loan Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md flex items-center gap-2">
                      <PieChartIcon size={16} />
                      Loan Breakdown
                    </CardTitle>
                    <CardDescription>
                      Breakdown of your loan amount
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={loanBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {loanBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Active Loans</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  You don't have any active loans at the moment. Apply for a new loan to get started.
                </p>
                <Button asChild>
                  <Link to="/dashboard/user/loan-application" className="flex items-center gap-1">
                    <Plus size={16} /> Apply for New Loan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Pending Applications Tab */}
        <TabsContent value="pending" className="space-y-4">
          {pendingLoans.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pendingLoans.map(loan => (
                <Card key={loan.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{loan.purpose}</CardTitle>
                      {getLoanStatusBadge(loan.status)}
                    </div>
                    <CardDescription>Application submitted on {formatDate(loan.startDate)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Loan Amount</p>
                        <p className="font-semibold">{formatCurrency(loan.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Term</p>
                        <p className="font-semibold">{loan.term} months</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 flex justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={14} />
                      <span>Est. approval within 48 hours</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/user/loans/${loan.id}`}>Track Application</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Pending Applications</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  You don't have any pending loan applications at the moment.
                </p>
                <Button asChild>
                  <Link to="/dashboard/user/loan-application" className="flex items-center gap-1">
                    <Plus size={16} /> Apply for New Loan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Completed Loans Tab */}
        <TabsContent value="completed" className="space-y-4">
          {completedLoans.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {completedLoans.map(loan => (
                <Card key={loan.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{loan.purpose}</CardTitle>
                      {getLoanStatusBadge(loan.status)}
                    </div>
                    <CardDescription>Completed on {formatDate(loan.endDate)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Loan Amount</p>
                        <p className="font-semibold">{formatCurrency(loan.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Term</p>
                        <p className="font-semibold">{loan.term} months</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 flex justify-between">
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle size={14} />
                      <span>Fully repaid</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/user/loans/${loan.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Completed Loans</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  Once you complete repayment of a loan, it will appear here.
                </p>
                <Button asChild>
                  <Link to="/dashboard/user/loan-application" className="flex items-center gap-1">
                    <Plus size={16} /> Apply for New Loan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
