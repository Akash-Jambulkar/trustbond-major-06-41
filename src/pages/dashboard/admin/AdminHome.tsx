
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useBlockchain } from "@/contexts/BlockchainContext";
import { BadgeDollarSign, BarChart3, Clock, RefreshCcw, ShieldCheck, AlertTriangle, Users, Database, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminHome = () => {
  const { toast } = useToast();
  const { isConnected } = useBlockchain();
  
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    pendingBanks: 0,
    totalTransactions: 0,
    pendingKYC: 0,
    totalUsers: 0,
    usersByRole: { user: 0, bank: 0, admin: 0 }
  });

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch transactions to display in the UI
      const { data: txs, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (txError) throw txError;
      setTransactions(txs || []);
      
      // Fetch pending bank registrations
      const { data: bankData, error: bankError } = await supabase
        .from('bank_registrations')
        .select('*')
        .eq('status', 'pending');
      
      if (bankError) throw bankError;
      
      // Fetch pending KYC documents
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('verification_status', 'pending');
      
      if (kycError) throw kycError;
      
      // Fetch user roles and count by role
      const { data: roleData, error: roleError } = await supabase
        .from('user_role_assignments')
        .select('role');
      
      if (roleError) throw roleError;
      
      // Calculate statistics
      const pendingBanks = bankData?.length || 0;
      const totalTransactions = txs?.length || 0;
      const pendingKYC = kycData?.length || 0;
      
      // Count users by role
      const usersByRole = roleData?.reduce((acc, item) => {
        const role = item.role;
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, { user: 0, bank: 0, admin: 0 });
      
      const totalUsers = roleData?.length || 0;
      
      console.log('User distribution:', usersByRole);
      
      setDashboardStats({
        pendingBanks,
        totalTransactions,
        pendingKYC,
        totalUsers,
        usersByRole
      });
      
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      toast({
        variant: "destructive",
        title: "Error loading dashboard data",
        description: "Failed to fetch data from the database."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const prepareTransactionChartData = () => {
    if (!transactions.length) return [];
    
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    
    const txsByDate = transactions.reduce((acc, tx) => {
      const date = new Date(tx.created_at).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { count: 0, pending: 0, confirmed: 0, failed: 0 };
      acc[date].count += 1;
      acc[date][tx.status] += 1;
      return acc;
    }, {});
    
    return last7Days.map(date => ({
      name: date,
      transactions: txsByDate[date]?.count || 0,
      pending: txsByDate[date]?.pending || 0,
      confirmed: txsByDate[date]?.confirmed || 0,
      failed: txsByDate[date]?.failed || 0
    }));
  };

  const prepareUserRoleData = () => {
    return [
      { name: 'Users', value: dashboardStats.usersByRole.user },
      { name: 'Banks', value: dashboardStats.usersByRole.bank },
      { name: 'Admins', value: dashboardStats.usersByRole.admin }
    ];
  };

  const transactionData = prepareTransactionChartData();
  const userRoleData = prepareUserRoleData();

  const handleRefresh = () => {
    fetchAllData();
    toast({
      title: "Dashboard refreshed",
      description: "Data has been updated from the database.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={fetchAllData} disabled={isLoading}>
          {isLoading ? 
            <Clock className="mr-2 h-4 w-4 animate-spin" /> : 
            <RefreshCcw className="mr-2 h-4 w-4" />
          }
          Refresh Data
        </Button>
      </div>

      {!isConnected && (
        <Alert variant="destructive" className="mb-6 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Blockchain connection not detected</AlertTitle>
          <AlertDescription>
            Some features require blockchain connection. Please connect your wallet for full functionality.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Bank Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{isLoading ? '...' : dashboardStats.pendingBanks}</div>
              <Building className="h-8 w-8 text-trustbond-primary" />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <a href="/dashboard/admin/bank-approvals">View all requests</a>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{isLoading ? '...' : dashboardStats.totalTransactions}</div>
              <BadgeDollarSign className="h-8 w-8 text-trustbond-secondary" />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <a href="/dashboard/admin/transactions">View transactions</a>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{isLoading ? '...' : dashboardStats.pendingKYC}</div>
              <ShieldCheck className="h-8 w-8 text-trustbond-accent" />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="text-xs">Monitor verifications</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{isLoading ? '...' : dashboardStats.totalUsers}</div>
              <Users className="h-8 w-8 text-gray-500" />
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {!isLoading && `Users: ${dashboardStats.usersByRole.user || 0} · Banks: ${dashboardStats.usersByRole.bank || 0} · Admins: ${dashboardStats.usersByRole.admin || 0}`}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <a href="/dashboard/admin/users">Manage users</a>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transaction Analysis</TabsTrigger>
          <TabsTrigger value="users">User Distribution</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Activity (Last 7 Days)</CardTitle>
              <CardDescription>
                Overview of blockchain transactions processed in the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={transactionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="transactions" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="confirmed" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="pending" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Role Distribution</CardTitle>
              <CardDescription>
                Breakdown of users by their roles in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={userRoleData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>
            Current status of system components and blockchain connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2 text-trustbond-primary" />
                <span>Database Connection</span>
              </div>
              <span className="text-green-500 font-medium">Operational</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-trustbond-secondary" />
                <span>Blockchain Connection</span>
              </div>
              <span className={isConnected ? "text-green-500 font-medium" : "text-amber-500 font-medium"}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <Progress value={isConnected ? 100 : 0} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
