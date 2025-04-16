
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { 
  Shield, 
  CreditCard, 
  UserCheck, 
  AlertTriangle, 
  ChevronRight,
  BarChart2,
  CheckSquare,
  Users
} from "lucide-react";
import { LoanAnalyticsDashboard } from "@/components/analytics/LoanAnalyticsDashboard";
import { getDocumentsNeedingConsensus } from "@/utils/consensusVerifier";
import { supabase } from "@/lib/supabase";

const BankHome = () => {
  const { user } = useAuth();
  const { isConnected, loanContract } = useBlockchain();
  const navigate = useNavigate();

  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [activeLoans, setActiveLoans] = useState(0);
  const [consensusRequests, setConsensusRequests] = useState(0);
  const [verificationRate, setVerificationRate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isConnected) return;
      
      setIsLoading(true);
      try {
        // Fetch real consensus requests
        const documents = await getDocumentsNeedingConsensus();
        setConsensusRequests(documents.length);
        
        // Fetch KYC verifications from database
        try {
          const { count } = await supabase
            .from('kyc_verifications')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');
          setPendingVerifications(count || 0);
        } catch (error) {
          console.error("Error fetching KYC verifications:", error);
          setPendingVerifications(0);
        }
        
        // Get active loans from database
        try {
          const { count } = await supabase
            .from('loans')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');
          setActiveLoans(count || 0);
        } catch (error) {
          console.error("Error fetching loan data:", error);
          setActiveLoans(0);
        }
        
        // Calculate verification rate
        try {
          const { count: totalCount } = await supabase
            .from('kyc_verifications')
            .select('*', { count: 'exact', head: true });
          
          const { count: verifiedCount } = await supabase
            .from('kyc_verifications')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'verified');
          
          if (totalCount && totalCount > 0) {
            setVerificationRate(Math.round((verifiedCount || 0) / totalCount * 100));
          } else {
            setVerificationRate(0);
          }
        } catch (error) {
          console.error("Error calculating verification rate:", error);
          setVerificationRate(0);
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isConnected, loanContract]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || 'Bank'}</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/dashboard/bank/verify-kyc")}
            variant="outline"
            className="gap-1"
          >
            <UserCheck className="h-4 w-4" />
            <span>Verify KYC</span>
          </Button>
          <Button 
            onClick={() => navigate("/dashboard/bank/manage-loans")}
            className="bg-trustbond-primary hover:bg-trustbond-primary/90 gap-1"
          >
            <CreditCard className="h-4 w-4" />
            <span>Manage Loans</span>
          </Button>
        </div>
      </div>

      {!isConnected && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="mt-0.5 text-amber-600" />
              <div>
                <h3 className="font-medium text-amber-800">Wallet Not Connected</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Connect your wallet to access all TrustBond features and perform verification operations on the blockchain.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC Verifications</CardTitle>
            <UserCheck className="h-4 w-4 text-trustbond-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : pendingVerifications}</div>
            <p className="text-xs text-muted-foreground">
              {pendingVerifications > 0 
                ? `${pendingVerifications} verification${pendingVerifications > 1 ? 's' : ''} waiting` 
                : 'No pending verifications'}
            </p>
            <Button 
              variant="link" 
              className="p-0 h-auto mt-2 text-sm flex items-center gap-1"
              onClick={() => navigate("/dashboard/bank/verify-kyc")}
            >
              Process Verifications
              <ChevronRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-trustbond-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : activeLoans}</div>
            <p className="text-xs text-muted-foreground">
              {activeLoans > 0 ? `${activeLoans} active loan${activeLoans !== 1 ? 's' : ''}` : 'No active loans'}
            </p>
            <Button 
              variant="link" 
              className="p-0 h-auto mt-2 text-sm flex items-center gap-1"
              onClick={() => navigate("/dashboard/bank/manage-loans")}
            >
              View Loans
              <ChevronRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consensus Requests</CardTitle>
            <Users className="h-4 w-4 text-trustbond-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : consensusRequests}</div>
            <p className="text-xs text-muted-foreground">
              {consensusRequests > 0 
                ? `${consensusRequests} document${consensusRequests !== 1 ? 's' : ''} awaiting consensus` 
                : 'No pending consensus requests'}
            </p>
            <Button 
              variant="link" 
              className="p-0 h-auto mt-2 text-sm flex items-center gap-1"
              onClick={() => navigate("/dashboard/bank/consensus-verification")}
            >
              Review Requests
              <ChevronRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
            <CheckSquare className="h-4 w-4 text-trustbond-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : `${verificationRate}%`}</div>
            <Progress value={verificationRate} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {isLoading 
                ? "Loading verification rate..." 
                : verificationRate > 0 
                  ? `Last 30 days: ${verificationRate > 90 ? 'Excellent' : verificationRate > 70 ? 'Good' : 'Needs improvement'}`
                  : "No verification data available"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Performance Overview
            </CardTitle>
            <CardDescription>
              Review your bank's performance metrics and loan portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoanAnalyticsDashboard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankHome;
