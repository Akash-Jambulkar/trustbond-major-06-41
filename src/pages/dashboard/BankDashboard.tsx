
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { NetworkStatus } from "@/components/NetworkStatus";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Shield, 
  CreditCard, 
  CheckCircle, 
  FileText, 
  Building2, 
  PieChart, 
  Users,
  Server,
  ArrowRight,
  BarChart3,
  AlertTriangle
} from "lucide-react";

const BankDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    isConnected, 
    account, 
    networkId, 
    kycContract, 
    loanContract,
    getKYCStatus,
    refreshTransactions 
  } = useBlockchain();

  const [kycPendingCount, setKycPendingCount] = useState<number>(0);
  const [activeLoansCount, setActiveLoansCount] = useState<number>(0);
  const [activeLoanAmount, setActiveLoanAmount] = useState<string>("0");
  const [trustScoreCount, setTrustScoreCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recentActivities, setRecentActivities] = useState<Array<{
    type: string;
    status: string;
    timestamp: Date;
    address?: string;
  }>>([]);

  // Load dashboard data from blockchain
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isConnected || !kycContract || !loanContract) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Get pending KYC documents count
        const pendingKYCEvents = await kycContract.getPastEvents('KYCSubmitted', {
          fromBlock: 0,
          toBlock: 'latest'
        });

        // Filter only pending documents (those without approval/rejection events)
        const verifiedAddresses = new Set();
        const rejectedAddresses = new Set();

        const verifiedEvents = await kycContract.getPastEvents('KYCVerified', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        
        verifiedEvents.forEach(event => {
          verifiedAddresses.add(event.returnValues.user);
        });

        const rejectedEvents = await kycContract.getPastEvents('KYCRejected', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        
        rejectedEvents.forEach(event => {
          rejectedAddresses.add(event.returnValues.user);
        });

        // Count only those that are neither verified nor rejected
        const pendingCount = pendingKYCEvents.filter(event => {
          const address = event.returnValues.user;
          return !verifiedAddresses.has(address) && !rejectedAddresses.has(address);
        }).length;

        setKycPendingCount(pendingCount);

        // Get active loans
        const loanEvents = await loanContract.getPastEvents('LoanCreated', {
          fromBlock: 0,
          toBlock: 'latest'
        });

        const loanIds = loanEvents.map(event => event.returnValues.loanId);
        
        // Get loan details in batches to avoid gas limit issues
        const loanPromises = loanIds.map(id => loanContract.methods.getLoan(id).call());
        const loans = await Promise.all(loanPromises);
        
        // Filter active loans (status 4 or 5)
        const activeLoans = loans.filter(loan => 
          loan.status === '4' || loan.status === '5'
        );
        
        setActiveLoansCount(activeLoans.length);
        
        // Calculate total loan amount
        const totalAmount = activeLoans.reduce((acc, loan) => {
          const amount = window.web3?.utils.fromWei(loan.amount, 'ether') || '0';
          return acc + parseFloat(amount);
        }, 0);
        
        setActiveLoanAmount(totalAmount.toFixed(2));

        // Get trust score count
        setTrustScoreCount(verifiedAddresses.size);

        // Get recent activities
        const allEvents = [
          ...pendingKYCEvents.map(event => ({
            type: 'KYC Verification',
            status: 'Pending',
            timestamp: new Date(parseInt(event.returnValues.timestamp) * 1000),
            address: event.returnValues.user
          })),
          ...verifiedEvents.map(event => ({
            type: 'KYC Verification',
            status: 'Approved',
            timestamp: new Date(parseInt(event.returnValues.timestamp) * 1000),
            address: event.returnValues.user
          })),
          ...rejectedEvents.map(event => ({
            type: 'KYC Verification',
            status: 'Rejected',
            timestamp: new Date(parseInt(event.returnValues.timestamp) * 1000),
            address: event.returnValues.user
          })),
          ...loanEvents.map(event => ({
            type: 'Loan Application',
            status: 'Created',
            timestamp: new Date(parseInt(event.returnValues.timestamp) * 1000),
            address: event.returnValues.borrower
          }))
        ];

        // Sort by timestamp descending and take the first 5
        const sortedActivities = allEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 5);

        setRecentActivities(sortedActivities);

        // Refresh transactions
        await refreshTransactions();
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data from blockchain");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isConnected, kycContract, loanContract, refreshTransactions]);

  // Format account address
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    if (!date) return "";
    return date.toLocaleDateString();
  };

  // Check if this is a nested route, if so, just render the Outlet
  if (window.location.pathname !== "/dashboard/bank") {
    return <Outlet />;
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bank Dashboard</h2>
        <NetworkStatus />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Requests</CardTitle>
            <FileText className="h-4 w-4 text-trustbond-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : kycPendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Pending verification
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-trustbond-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : activeLoansCount}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading..." : `Total ${activeLoanAmount} ETH`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trust Scores</CardTitle>
            <PieChart className="h-4 w-4 text-trustbond-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : trustScoreCount}</div>
            <p className="text-xs text-muted-foreground">
              Generated from blockchain
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blockchain Status</CardTitle>
            <Shield className="h-4 w-4 text-trustbond-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isConnected ? "Active" : "Not Connected"}</div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? `Network ID: ${networkId}` : "Connect wallet to continue"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Recent Activities</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest blockchain transactions and activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-muted-foreground">Loading activities from blockchain...</p>
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="space-y-2">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        {activity.type === 'KYC Verification' ? (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">{activity.type}</span>
                        {activity.status === 'Pending' && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
                        )}
                        {activity.status === 'Approved' && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
                        )}
                        {activity.status === 'Rejected' && (
                          <Badge variant="destructive">Rejected</Badge>
                        )}
                        {activity.status === 'Created' && (
                          <Badge variant="outline">Created</Badge>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </span>
                        {activity.address && (
                          <span className="text-xs text-muted-foreground">
                            {formatAddress(activity.address)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-muted-foreground">No recent activities</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="actions" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common banking operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center" onClick={() => navigate('/dashboard/bank/verify-kyc')}>
                  <FileText className="h-5 w-5 mb-1" />
                  <span>Verify KYC</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center" onClick={() => navigate('/dashboard/bank/consensus-verification')}>
                  <Users className="h-5 w-5 mb-1" />
                  <span>Consensus Verification</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center" onClick={() => navigate('/dashboard/bank/manage-loans')}>
                  <CreditCard className="h-5 w-5 mb-1" />
                  <span>Manage Loans</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center" onClick={() => navigate('/dashboard/bank/trust-scores')}>
                  <PieChart className="h-5 w-5 mb-1" />
                  <span>Check Trust Scores</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center" onClick={() => navigate('/dashboard/bank/transactions')}>
                  <Server className="h-5 w-5 mb-1" />
                  <span>Blockchain Transactions</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center" onClick={() => navigate('/dashboard/bank/secure-sharing')}>
                  <Shield className="h-5 w-5 mb-1" />
                  <span>Secure Sharing</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>Regulatory compliance status</CardDescription>
            </div>
            <Shield className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">KYC Verification</span>
                <Badge className="bg-green-100 text-green-800">Compliant</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AML Procedures</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Security Audit</span>
                <Badge className="bg-green-100 text-green-800">Passed</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Smart Contract Audit</span>
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Current risk evaluation metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Default Risk</span>
                  <span className="font-medium text-green-500">Low (12%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '12%' }} />
                </div>
              </div>
              
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Market Risk</span>
                  <span className="font-medium text-amber-500">Medium (38%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: '38%' }} />
                </div>
              </div>
              
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Liquidity Risk</span>
                  <span className="font-medium text-amber-500">Medium (45%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: '45%' }} />
                </div>
              </div>
              
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Operational Risk</span>
                  <span className="font-medium text-green-500">Low (8%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '8%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankDashboard;
