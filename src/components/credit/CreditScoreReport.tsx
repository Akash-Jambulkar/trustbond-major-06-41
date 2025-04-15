
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCreditScore, type CreditScoreResponse } from "@/utils/api/creditScoreApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, CheckCircle, Info, ArrowUpRight } from "lucide-react";

export const CreditScoreReport: React.FC = () => {
  const { user } = useAuth();
  const [creditData, setCreditData] = useState<CreditScoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCreditScore = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCreditScore(user.id);
        setCreditData(data);
      } catch (err) {
        console.error("Failed to load credit score:", err);
        setError("Unable to retrieve your credit score at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCreditScore();
  }, [user?.id]);

  const getScoreColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-amber-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScorePercentage = (score: number, min: number, max: number) => {
    return ((score - min) / (max - min)) * 100;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading credit score information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !creditData) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-muted-foreground">{error || "No credit data available"}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const scorePercentage = getScorePercentage(
    creditData.score,
    creditData.minScore,
    creditData.maxScore
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Your Credit Score Report</CardTitle>
        <CardDescription>
          External credit assessment from our partner agencies as of {new Date(creditData.reportDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
          <div className="text-center mb-4">
            <h3 className="text-4xl font-bold mb-1">{creditData.score}</h3>
            <p className="text-sm text-muted-foreground">
              out of {creditData.maxScore}
            </p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium capitalize bg-opacity-10" 
                 style={{ backgroundColor: `rgba(var(--${creditData.status === 'excellent' ? 'success' : creditData.status === 'good' ? 'info' : creditData.status === 'fair' ? 'warning' : 'destructive'}-rgb), 0.1)`, 
                          color: `hsl(var(--${creditData.status === 'excellent' ? 'success' : creditData.status === 'good' ? 'info' : creditData.status === 'fair' ? 'warning' : 'destructive'}))` }}>
              {creditData.status}
            </div>
          </div>
          
          <div className="w-full max-w-md mb-2">
            <Progress 
              value={scorePercentage} 
              className="h-2" 
            />
          </div>
          
          <div className="w-full max-w-md flex justify-between text-xs text-muted-foreground">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>
        
        <Tabs defaultValue="factors" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="factors">Factors</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="factors" className="space-y-4">
            <div className="space-y-4">
              {creditData.factors.map((factor, index) => (
                <div key={factor.type} className="flex items-start">
                  <div className={`mt-0.5 p-1 rounded-full ${
                    factor.impact === 'high' 
                      ? 'bg-red-100' 
                      : factor.impact === 'medium' 
                        ? 'bg-amber-100' 
                        : 'bg-blue-100'
                  }`}>
                    <Info className={`h-4 w-4 ${
                      factor.impact === 'high' 
                        ? 'text-red-600' 
                        : factor.impact === 'medium' 
                          ? 'text-amber-600' 
                          : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">{factor.description}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="capitalize font-medium">{factor.impact}</span> impact on your credit score
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <div className="space-y-4">
              {creditData.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start">
                  <div className={`mt-0.5 p-1 rounded-full ${
                    rec.impact === 'high' 
                      ? 'bg-green-100' 
                      : rec.impact === 'medium' 
                        ? 'bg-blue-100' 
                        : 'bg-purple-100'
                  }`}>
                    <CheckCircle className={`h-4 w-4 ${
                      rec.impact === 'high' 
                        ? 'text-green-600' 
                        : rec.impact === 'medium' 
                          ? 'text-blue-600' 
                          : 'text-purple-600'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">{rec.action}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          This credit score is provided for informational purposes only and may differ from scores used by lenders.
        </p>
        <Button variant="outline" size="sm" className="text-xs">
          <span>Full Report</span>
          <ArrowUpRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};
