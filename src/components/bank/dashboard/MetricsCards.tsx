
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CreditCard, PieChart, Shield } from "lucide-react";

type MetricsCardsProps = {
  kycPendingCount: number;
  activeLoansCount: number;
  activeLoanAmount: string;
  trustScoreCount: number;
  isConnected: boolean;
  networkId?: string;
  isLoading: boolean;
};

export const MetricsCards = ({
  kycPendingCount,
  activeLoansCount,
  activeLoanAmount,
  trustScoreCount,
  isConnected,
  networkId,
  isLoading
}: MetricsCardsProps) => {
  return (
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
  );
};
