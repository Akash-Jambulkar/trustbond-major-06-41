
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export const ComplianceAndRisk = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Compliance Overview</CardTitle>
            <CardDescription>Regulatory compliance status</CardDescription>
          </div>
          <Shield className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">KYC Verification</span>
              <Badge className="bg-green-100 text-green-800">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AML Procedures</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Security Audit</span>
              <Badge className="bg-green-100 text-green-800">Passed</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Smart Contract Audit</span>
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Current risk evaluation metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Default Risk</span>
                <span className="font-medium text-green-500">Low (12%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '12%' }} />
              </div>
            </div>
            
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Market Risk</span>
                <span className="font-medium text-amber-500">Medium (38%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: '38%' }} />
              </div>
            </div>
            
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Liquidity Risk</span>
                <span className="font-medium text-amber-500">Medium (45%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: '45%' }} />
              </div>
            </div>
            
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Operational Risk</span>
                <span className="font-medium text-green-500">Low (8%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '8%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
