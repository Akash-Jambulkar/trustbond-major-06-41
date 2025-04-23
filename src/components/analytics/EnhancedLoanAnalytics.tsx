
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const EnhancedLoanAnalytics = () => {
  const { account, web3, loanContract, isConnected } = useBlockchain();
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [repaymentData, setRepaymentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!isConnected || !account || !loanContract || !web3) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Get loan data from blockchain
        const loanIds = await loanContract.methods.getUserLoans(account).call();
        
        if (loanIds.length === 0) {
          setIsLoading(false);
          return;
        }
        
        const loanPromises = loanIds.map((id: string) => 
          loanContract.methods.getLoan(id).call()
        );
        
        const loanDetails = await Promise.all(loanPromises);
        
        // Also get data from Supabase for historical context
        const { data: loanEvents } = await supabase
          .from("loan_events")
          .select("*")
          .order("created_at", { ascending: true });
          
        // Process performance data (loan completion over time)
        const performance = loanDetails.map((loan: any, index: number) => {
          const status = parseInt(loan.status);
          const amount = web3.utils.fromWei(loan.amount, "ether");
          const remaining = web3.utils.fromWei(loan.remainingAmount || "0", "ether");
          const progress = Math.round(((parseFloat(amount) - parseFloat(remaining)) / parseFloat(amount)) * 100);
          
          return {
            id: loanIds[index],
            progress,
            amount: parseFloat(amount),
            remaining: parseFloat(remaining),
            status: ["Pending", "Rejected", "Approved", "Active", "Completed", "Defaulted"][status] || "Unknown",
          };
        });
        
        // Process distribution data (loan purposes)
        const purposes: Record<string, number> = {};
        loanDetails.forEach((loan: any) => {
          const purpose = loan.purpose || "Other";
          purposes[purpose] = (purposes[purpose] || 0) + parseFloat(web3.utils.fromWei(loan.amount, "ether"));
        });
        
        const distribution = Object.entries(purposes).map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2))
        }));
        
        // Process repayment data (monthly repayments)
        const eventsByMonth: Record<string, number> = {};
        if (loanEvents) {
          loanEvents.forEach((event: any) => {
            if (event.event_type === 'repayment') {
              const date = new Date(event.created_at);
              const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
              const amount = parseFloat(event.amount || 0);
              
              eventsByMonth[monthYear] = (eventsByMonth[monthYear] || 0) + amount;
            }
          });
        }
        
        const repayments = Object.entries(eventsByMonth).map(([month, amount]) => ({
          month,
          amount: parseFloat(amount.toFixed(4))
        }));
        
        setPerformanceData(performance);
        setDistributionData(distribution);
        setRepaymentData(repayments.sort((a, b) => {
          const [aMonth, aYear] = a.month.split('/').map(Number);
          const [bMonth, bYear] = b.month.split('/').map(Number);
          return (aYear * 12 + aMonth) - (bYear * 12 + bMonth);
        }).slice(-12)); // Last 12 months
        
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [account, loanContract, web3, isConnected]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loan Analytics</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced Loan Analytics</CardTitle>
        <CardDescription>Detailed analysis of your loan portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance">
          <TabsList className="w-full mb-4 grid grid-cols-3">
            <TabsTrigger value="performance">Loan Progress</TabsTrigger>
            <TabsTrigger value="distribution">Purpose Distribution</TabsTrigger>
            <TabsTrigger value="repayment">Repayment Trend</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            {performanceData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="id" tick={false} label="Loans" />
                    <YAxis label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Completion']} labelFormatter={(id) => `Loan ${id.substring(0, 6)}...`} />
                    <Legend />
                    <Bar dataKey="progress" name="Completion %" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No loan performance data available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="distribution">
            {distributionData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} ETH`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No loan distribution data available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="repayment">
            {repaymentData.length > 0 ? (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={repaymentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Amount (ETH)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: any) => [`${value} ETH`, 'Repaid']} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#00C49F" activeDot={{ r: 8 }} name="Monthly Repayments" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No repayment trend data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
