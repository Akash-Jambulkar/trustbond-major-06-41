
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Link } from "react-router-dom";
import { ChevronRight, Shield, ChartBar, Wallet, FileCheck, BarChart, CreditCard, BookOpen } from "lucide-react";

const UserHome = () => {
  const { user } = useAuth();
  const { isConnected } = useBlockchain();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || user?.email || "User"}</h1>
          <p className="text-muted-foreground mt-1">
            Your secure blockchain-based KYC and loan management dashboard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Verified</div>
            <p className="text-xs text-muted-foreground">
              Documents verified and approved
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/user/kyc" className="text-sm text-trustbond-primary flex items-center">
              View details <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <p className="text-xs text-muted-foreground">
              Excellent credit rating
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/user/trust-score" className="text-sm text-trustbond-primary flex items-center">
              View details <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Currently active loan contracts
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/user/loans" className="text-sm text-trustbond-primary flex items-center">
              View loans <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.45 ETH</div>
            <p className="text-xs text-muted-foreground">
              Due in 8 days (May 23, 2025)
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/user/loans" className="text-sm text-trustbond-primary flex items-center">
              View schedule <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 h-auto">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access common tasks and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/dashboard/user/loan-application">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50">
                  <Wallet className="h-6 w-6 text-trustbond-primary" />
                  <div className="text-center">
                    <div className="font-medium">Apply for Loan</div>
                    <p className="text-xs text-muted-foreground">Create a new loan request</p>
                  </div>
                </Button>
              </Link>
              <Link to="/dashboard/user/kyc">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50">
                  <FileCheck className="h-6 w-6 text-trustbond-primary" />
                  <div className="text-center">
                    <div className="font-medium">KYC Documents</div>
                    <p className="text-xs text-muted-foreground">Manage verification docs</p>
                  </div>
                </Button>
              </Link>
              <Link to="/dashboard/user/security">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 bg-amber-50 border-amber-200">
                  <Shield className="h-6 w-6 text-amber-600" />
                  <div className="text-center">
                    <div className="font-medium">Security Settings</div>
                    <p className="text-xs text-muted-foreground">Enhance your security</p>
                  </div>
                </Button>
              </Link>
              <Link to="/dashboard/user/loans">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50">
                  <ChartBar className="h-6 w-6 text-trustbond-primary" />
                  <div className="text-center">
                    <div className="font-medium">Manage Loans</div>
                    <p className="text-xs text-muted-foreground">View and manage loans</p>
                  </div>
                </Button>
              </Link>
              <Link to="/dashboard/user/analytics">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 bg-blue-50 border-blue-200">
                  <BarChart className="h-6 w-6 text-blue-600" />
                  <div className="text-center">
                    <div className="font-medium">Analytics Dashboard</div>
                    <p className="text-xs text-muted-foreground">View loan performance</p>
                  </div>
                </Button>
              </Link>
              <Link to="/dashboard/user/credit-score">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 bg-green-50 border-green-200">
                  <CreditCard className="h-6 w-6 text-green-600" />
                  <div className="text-center">
                    <div className="font-medium">Credit Score</div>
                    <p className="text-xs text-muted-foreground">External credit reports</p>
                  </div>
                </Button>
              </Link>
            </div>
            
            <div className="mt-4">
              <Link to="/dashboard/user/compliance-market">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 bg-purple-50 border-purple-200">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  <div className="text-center">
                    <div className="font-medium">Compliance & Market</div>
                    <p className="text-xs text-muted-foreground">Regulatory compliance and market data</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blockchain Status</CardTitle>
            <CardDescription>
              Connection and transaction status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Wallet Connection</span>
                <span className={`text-sm ${isConnected ? "text-green-600" : "text-amber-600"}`}>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Mode</span>
                <span className="text-sm">Production</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pending Transactions</span>
                <span className="text-sm">0</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/user/transactions" className="w-full">
              <Button variant="outline" className="w-full">
                View Transaction History
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserHome;
