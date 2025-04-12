
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface LoanStatsProps {
  kyc: number;
  trustScore: number | null;
  loadingUserData: boolean;
}

export const LoanStats: React.FC<LoanStatsProps> = ({ 
  kyc, 
  trustScore, 
  loadingUserData 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">KYC Status</h3>
              {loadingUserData ? (
                <span className="text-sm text-muted-foreground">Loading...</span>
              ) : (
                <div className="flex items-center">
                  {kyc ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">Not Verified</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <Progress value={kyc * 100} className="h-2" />
            {!kyc && (
              <p className="text-xs text-muted-foreground">
                You need to complete KYC verification before applying for loans.
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Trust Score</h3>
              {loadingUserData ? (
                <span className="text-sm text-muted-foreground">Loading...</span>
              ) : trustScore !== null ? (
                <span className="text-sm font-semibold">{trustScore}/100</span>
              ) : (
                <span className="text-sm text-muted-foreground">Not Available</span>
              )}
            </div>
            <Progress value={trustScore || 0} className="h-2" />
            <p className="text-xs text-muted-foreground">
              A higher trust score can help you get better loan terms.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
