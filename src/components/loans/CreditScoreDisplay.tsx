
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CREDIT_TIERS } from "@/utils/creditScoring";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface CreditScoreDisplayProps {
  trustScore: number | null;
  kycVerified: boolean;
}

export function CreditScoreDisplay({ trustScore, kycVerified }: CreditScoreDisplayProps) {
  if (trustScore === null) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Credit Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Connect your wallet to view your credit score
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine credit tier based on trust score
  let tier = 'VERY_POOR';
  let color = 'bg-red-500';
  let textColor = 'text-red-800';
  let bgColor = 'bg-red-50';
  
  if (trustScore >= CREDIT_TIERS.EXCELLENT.min) {
    tier = 'EXCELLENT';
    color = 'bg-green-500';
    textColor = 'text-green-800';
    bgColor = 'bg-green-50';
  } else if (trustScore >= CREDIT_TIERS.VERY_GOOD.min) {
    tier = 'VERY_GOOD';
    color = 'bg-emerald-500';
    textColor = 'text-emerald-800';
    bgColor = 'bg-emerald-50';
  } else if (trustScore >= CREDIT_TIERS.GOOD.min) {
    tier = 'GOOD';
    color = 'bg-blue-500';
    textColor = 'text-blue-800';
    bgColor = 'bg-blue-50';
  } else if (trustScore >= CREDIT_TIERS.FAIR.min) {
    tier = 'FAIR';
    color = 'bg-yellow-500';
    textColor = 'text-yellow-800';
    bgColor = 'bg-yellow-50';
  } else if (trustScore >= CREDIT_TIERS.POOR.min) {
    tier = 'POOR';
    color = 'bg-orange-500';
    textColor = 'text-orange-800';
    bgColor = 'bg-orange-50';
  }

  const getLoanEligibility = () => {
    if (!kycVerified) {
      return {
        eligible: false,
        message: "Complete KYC verification to qualify for loans",
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      };
    }
    
    if (trustScore < 30) {
      return {
        eligible: false,
        message: "Your score is too low to qualify for loans",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      };
    }
    
    return {
      eligible: true,
      message: "You qualify for loans based on your score",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    };
  };

  const eligibility = getLoanEligibility();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Credit Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Your Score</span>
            <span className="font-medium">{trustScore} / 100</span>
          </div>
          <Progress value={trustScore} className="h-2" />
        </div>
        
        <div className={`p-3 rounded-md ${bgColor} ${textColor}`}>
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium">{tier}</div>
            <div className="text-sm">{CREDIT_TIERS[tier as keyof typeof CREDIT_TIERS].rate}% APR</div>
          </div>
          <div className="text-sm opacity-80">
            {tier === 'EXCELLENT' ? (
              "Top tier credit score with the best loan terms"
            ) : tier === 'VERY_GOOD' ? (
              "Above average score with favorable loan terms"
            ) : tier === 'GOOD' ? (
              "Average credit score with standard loan terms"
            ) : tier === 'FAIR' ? (
              "Below average score with less favorable terms"
            ) : tier === 'POOR' ? (
              "Low score with limited loan options"
            ) : (
              "Very limited borrowing capability"
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {eligibility.icon}
          <span className="text-sm">{eligibility.message}</span>
        </div>
        
        {!kycVerified && (
          <div className="text-sm text-muted-foreground">
            Complete KYC verification to improve your loan options.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
