
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { NetworkStatus } from "@/components/NetworkStatus";
import { Shield, CreditCard, LineChart, User, Users, Server, Building2, Settings } from "lucide-react";
import { BlockchainActions } from "@/components/blockchain/BlockchainActions";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

const AdminHome = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <NetworkStatus />
      </div>
      
      {/* Real-time dashboard metrics */}
      <DashboardStats userRole="admin" />
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Platform status and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">New User Registrations</span>
                  </div>
                  <span className="text-xs text-muted-foreground">12 this week</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Bank Onboarding</span>
                  </div>
                  <span className="text-xs text-muted-foreground">1 pending</span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Loan Applications</span>
                  </div>
                  <span className="text-xs text-muted-foreground">24 this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Administrative tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center">
                  <Users className="h-5 w-5 mb-1" />
                  <span>Manage Users</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center">
                  <Building2 className="h-5 w-5 mb-1" />
                  <span>Manage Banks</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center">
                  <Settings className="h-5 w-5 mb-1" />
                  <span>System Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blockchain" className="space-y-4">
          <BlockchainActions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHome;
