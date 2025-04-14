
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>KYC Status</CardTitle>
            <CardDescription>Your verification status</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Content will be added from KYCPage component */}
            <p>Check your KYC verification status</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
            <CardDescription>Your current loan status</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Content will be added from LoansPage component */}
            <p>View your active loans</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trust Score</CardTitle>
            <CardDescription>Your credit rating</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Credit score will be displayed here */}
            <p>View your current trust score</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
