
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BankDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bank Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending KYC Verifications</CardTitle>
            <CardDescription>Verification requests awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Review pending KYC verification requests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Loan Requests</CardTitle>
            <CardDescription>Pending loan applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View and approve loan applications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bank Performance</CardTitle>
            <CardDescription>Activity metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Review bank performance statistics</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankDashboard;
