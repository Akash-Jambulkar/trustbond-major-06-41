
import React, { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Shield, AlertTriangle, Info, Clock, CheckCircle, CreditCard, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function TrustScorePage() {
  const { account, isConnected, trustScoreContract, kycContract } = useBlockchain();
  const { user } = useAuth();
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [kycVerified, setKycVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [scoreHistory, setScoreHistory] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!isConnected || !trustScoreContract || !kycContract || !account) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch trust score from blockchain
        const score = await trustScoreContract.methods.calculateScore(account).call();
        setTrustScore(Number(score));

        // Fetch KYC status from blockchain
        const kycStatus = await kycContract.methods.getKYCStatus(account).call();
        setKycVerified(kycStatus);

        // Generate mock score history (would come from database in a real app)
        const mockHistory = [];
        const currentScore = Number(score);
        const now = new Date();
        
        // Generate 6 months of history
        for (let i = 0; i < 6; i++) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          
          // Random variation ±5 points from current score
          const variation = Math.floor(Math.random() * 10) - 5;
          const historicalScore = Math.max(0, Math.min(100, currentScore + variation));
          
          mockHistory.push({
            date: date.toISOString().split('T')[0],
            score: historicalScore
          });
        }
        
        setScoreHistory(mockHistory.reverse());
        
        // Mock transactions that could affect trust score
        setTransactions([
          {
            id: "tx1",
            type: "kyc_verification",
            description: "KYC Documents Verified",
            impact: "+20 points",
            date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
            positive: true
          },
          {
            id: "tx2",
            type: "loan_repayment",
            description: "Loan Repayment Completed",
            impact: "+5 points",
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
            positive: true
          },
          {
            id: "tx3",
            type: "loan_approval",
            description: "Loan Application Approved",
            impact: "+2 points",
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
            positive: true
          }
        ]);
      } catch (error) {
        console.error("Error fetching trust score data:", error);
        toast.error("Failed to fetch trust score data");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [isConnected, trustScoreContract, kycContract, account]);

  const getScoreTier = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-green-600" };
    if (score >= 80) return { label: "Very Good", color: "text-emerald-600" };
    if (score >= 70) return { label: "Good", color: "text-blue-600" };
    if (score >= 60) return { label: "Fair", color: "text-amber-600" };
    if (score >= 50) return { label: "Poor", color: "text-orange-600" };
    return { label: "Very Poor", color: "text-red-600" };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-600";
    if (score >= 80) return "bg-emerald-600";
    if (score >= 70) return "bg-blue-600";
    if (score >= 60) return "bg-amber-600";
    if (score >= 50) return "bg-orange-600";
    return "bg-red-600";
  };

  return (
    <div className="p-4 md:p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Trust Score Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and improve your blockchain-verified trust score
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-trustbond-primary"></div>
          <span className="ml-2">Loading trust score data...</span>
        </div>
      ) : !isConnected ? (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <Wallet className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Wallet Not Connected</AlertTitle>
          <AlertDescription className="text-amber-700">
            Connect your wallet to view your blockchain-verified trust score.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Trust Score Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-trustbond-primary" />
                  Trust Score Overview
                </CardTitle>
                <CardDescription>
                  Your blockchain-verified trust and reputation score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-40 h-40 rounded-full flex items-center justify-center bg-gray-100 border-8 border-gray-200 relative">
                    {trustScore !== null ? (
                      <>
                        <div 
                          className="absolute inset-0 rounded-full" 
                          style={{ 
                            clipPath: `inset(50% 0 0 0)`,
                            backgroundColor: getScoreColor(trustScore),
                            transform: `rotate(${trustScore * 3.6}deg)`, // Convert score to degrees (0-360)
                            transformOrigin: 'center'
                          }}
                        ></div>
                        <div className="flex flex-col items-center justify-center gap-1 z-10 bg-white rounded-full w-28 h-28">
                          <span className="text-3xl font-bold">{trustScore}</span>
                          <span className={`text-sm font-medium ${getScoreTier(trustScore).color}`}>
                            {getScoreTier(trustScore).label}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No Data</span>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">KYC Verification Status</h4>
                        {kycVerified ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Verified</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Pending</span>
                          </Badge>
                        )}
                      </div>
                      <Progress value={kycVerified ? 100 : 0} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Loan History Impact</h4>
                        <span className="text-xs text-muted-foreground">15/20 Points</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Payment History Impact</h4>
                        <span className="text-xs text-muted-foreground">18/20 Points</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Verification Uniqueness</h4>
                        <span className="text-xs text-muted-foreground">10/10 Points</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Score History (Last 6 Months)</h4>
                  <div className="h-40 flex items-end gap-1">
                    {scoreHistory.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-full ${getScoreColor(item.score)}`}
                          style={{ height: `${item.score}%` }}
                        ></div>
                        <span className="text-xs mt-1">{item.date.substring(5)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits Panel */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Score Benefits</CardTitle>
                <CardDescription>
                  Advantages of your current trust score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trustScore !== null && (
                  <>
                    <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                      <h3 className="font-medium text-green-800 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Loan Eligibility
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        {trustScore >= 80 
                          ? "Eligible for premium loan terms and lowest interest rates" 
                          : trustScore >= 60 
                          ? "Eligible for standard loan terms"
                          : "Limited loan eligibility"}
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                      <h3 className="font-medium text-blue-800 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        KYC Sharing
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        {kycVerified 
                          ? "Verified KYC allows instant identity sharing across banks" 
                          : "Complete KYC verification to unlock cross-bank identity sharing"}
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                      <h3 className="font-medium text-purple-800 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Interest Rates
                      </h3>
                      <p className="text-sm text-purple-700 mt-1">
                        {trustScore >= 90 
                          ? "Lowest interest rate: 4.5% APR" 
                          : trustScore >= 80 
                          ? "Low interest rate: 6.5% APR"
                          : trustScore >= 70
                          ? "Standard interest rate: 8.5% APR"
                          : trustScore >= 60
                          ? "Higher interest rate: 10.5% APR"
                          : "High interest rate: 12.5%+ APR"}
                      </p>
                    </div>
                  </>
                )}
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="/dashboard/user/loan-application">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Apply for a Loan
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact History & Recommendations */}
          <Tabs defaultValue="impacts" className="mt-6">
            <TabsList>
              <TabsTrigger value="impacts">Score Impacts</TabsTrigger>
              <TabsTrigger value="recommendations">Improvement Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="impacts">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Trust Score Impacts</CardTitle>
                  <CardDescription>
                    Factors that have affected your trust score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className={`p-2 rounded-full ${tx.positive ? 'bg-green-100' : 'bg-red-100'}`}>
                          {tx.type === "kyc_verification" ? (
                            <Shield className={`h-5 w-5 ${tx.positive ? 'text-green-600' : 'text-red-600'}`} />
                          ) : tx.type === "loan_repayment" ? (
                            <CreditCard className={`h-5 w-5 ${tx.positive ? 'text-green-600' : 'text-red-600'}`} />
                          ) : (
                            <CheckCircle className={`h-5 w-5 ${tx.positive ? 'text-green-600' : 'text-red-600'}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{tx.description}</h4>
                            <span className={`text-sm ${tx.positive ? 'text-green-600' : 'text-red-600'}`}>
                              {tx.impact}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {transactions.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground md:col-span-2">
                        No score impacts recorded yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Score Improvement Recommendations</CardTitle>
                  <CardDescription>
                    Steps you can take to improve your trust score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {!kycVerified && (
                      <Alert className="bg-blue-50 border-blue-200 md:col-span-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">Complete KYC Verification</AlertTitle>
                        <AlertDescription className="text-blue-700">
                          Completing your KYC verification will significantly improve your trust score.
                          <Button variant="link" className="text-blue-700 p-0 h-auto mt-1" asChild>
                            <a href="/dashboard/user/kyc">Complete KYC Now</a>
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                      <h3 className="font-medium text-green-800 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Apply for Small Loans
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        Start with smaller loans and repay them on time to build a positive loan history.
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                      <h3 className="font-medium text-purple-800 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Make Regular Repayments
                      </h3>
                      <p className="text-sm text-purple-700 mt-1">
                        Consistently making loan repayments on time will gradually improve your score.
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                      <h3 className="font-medium text-blue-800 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Keep Your Profile Updated
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Regularly update your profile information and maintain accurate personal details.
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <h3 className="font-medium text-amber-800 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Diversify Your Financial Activities
                      </h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Participate in various blockchain financial activities to demonstrate reliability.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
