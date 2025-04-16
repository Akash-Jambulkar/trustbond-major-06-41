
import React from "react";
import { LoanAnalyticsDashboard } from "@/components/analytics/LoanAnalyticsDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const AnalyticsPage = () => {
  const { user } = useAuth();
  const { isConnected, account } = useBlockchain();

  if (!isConnected || !account) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Analytics Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-trustbond-primary" />
            <p className="text-center text-muted-foreground">
              Please connect your wallet to view your personalized analytics.
            </p>
          </CardContent>
        </Card>
      )
  }

  return (
    <div className="w-full p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Loan Analytics for {user?.name}</h1>
        <p className="text-muted-foreground">
          View personalized analytics about your loan activity and performance
        </p>
      </div>
      <LoanAnalyticsDashboard />
    </div>
  );
};

export default AnalyticsPage;
