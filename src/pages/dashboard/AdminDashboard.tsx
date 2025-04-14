
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Platform statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View platform statistics and metrics</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bank Management</CardTitle>
            <CardDescription>Manage bank accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Register and manage bank accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Setup</CardTitle>
            <CardDescription>Configure blockchain settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Configure smart contracts and network settings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
