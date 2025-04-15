
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Users, CreditCard, PieChart, Server, Shield } from "lucide-react";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
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
  );
};
