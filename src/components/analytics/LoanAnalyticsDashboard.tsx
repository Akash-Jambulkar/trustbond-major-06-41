import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { BarChart2, PieChart as PieChartIcon, TrendingUp, AlertTriangle, Loader2, CreditCard, CheckCircle2 } from "lucide-react";

// Interface for user loan data
interface UserLoan {
  id: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  status: string;
  purpose: string;
  created_at: string;
  updated_at: string;
}

// Interface for analytics data
interface LoanPerformanceData {
  month: string;
  onTime: number;
  late: number;
  default: number;
}

interface RiskDistribution {
  name: string;
  value: number;
  color: string;
}

interface LoanTypeData {
  type: string;
  count: number;
}

interface TrendData {
  month: string;
  amount: number;
}

export const LoanAnalyticsDashboard: React.FC = () => {
  const { isConnected } = useBlockchain();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<"1m" | "3m" | "6m" | "1y">("6m");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // User-specific loan analytics state
  const [userLoans, setUserLoans] = useState<UserLoan[]>([]);
  const [performanceData, setPerformanceData] = useState<LoanPerformanceData[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution[]>([]);
  const [loanTypeData, setLoanTypeData] = useState<LoanTypeData[]>([]);
  const [trendsData, setTrendsData] = useState<TrendData[]>([]);
  
  // Stats
  const [totalActiveLoans, setTotalActiveLoans] = useState<number>(0);
  const [portfolioValue, setPortfolioValue] = useState<string>("0");
  const [repaymentRate, setRepaymentRate] = useState<number>(0);
  const [defaultRate, setDefaultRate] = useState<number>(0);
  
  // Fetch user loan data from Supabase
  useEffect(() => {
    const fetchUserLoans = async () => {
      if (!isConnected || !user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Fetch loans for the current user
        const { data, error } = await supabase
          .from('loans')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error("Error fetching user loans:", error);
          return;
        }
        
        if (data) {
          setUserLoans(data as UserLoan[]);
          
          // Process loan data for analytics
          processLoanData(data as UserLoan[]);
        }
      } catch (error) {
        console.error("Error in fetchUserLoans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserLoans();
  }, [isConnected, user]);
  
  // Process loan data to generate analytics
  const processLoanData = (loans: UserLoan[]) => {
    if (!loans || loans.length === 0) {
      // Set default empty data
      setPerformanceData(generateEmptyPerformanceData());
      setRiskDistribution(generateEmptyRiskDistribution());
      setLoanTypeData(generateEmptyLoanTypeData());
      setTrendsData(generateEmptyTrendsData());
      setTotalActiveLoans(0);
      setPortfolioValue("0");
      setRepaymentRate(0);
      setDefaultRate(0);
      return;
    }
    
    // Calculate key metrics
    const activeLoans = loans.filter(loan => 
      loan.status === 'approved' || loan.status === 'active'
    );
    
    setTotalActiveLoans(activeLoans.length);
    
    // Calculate portfolio value (sum of active loan amounts)
    const totalValue = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
    setPortfolioValue(totalValue.toFixed(2));
    
    // Calculate repayment and default rates based on historical data
    const completedLoans = loans.filter(loan => 
      loan.status === 'completed' || loan.status === 'defaulted'
    );
    
    if (completedLoans.length > 0) {
      const repaidLoans = completedLoans.filter(loan => loan.status === 'completed');
      setRepaymentRate(Math.round((repaidLoans.length / completedLoans.length) * 100));
      
      const defaultedLoans = completedLoans.filter(loan => loan.status === 'defaulted');
      setDefaultRate(Math.round((defaultedLoans.length / completedLoans.length) * 100));
    }
    
    // Generate performance data (monthly repayment history)
    setPerformanceData(generatePerformanceData(loans));
    
    // Generate risk distribution based on interest rates
    setRiskDistribution(generateRiskDistribution(loans));
    
    // Generate loan type distribution based on purpose
    setLoanTypeData(generateLoanTypeDistribution(loans));
    
    // Generate trends data (monthly loan amounts)
    setTrendsData(generateTrendsData(loans));
  };
  
  // Generate performance data based on actual loans
  const generatePerformanceData = (loans: UserLoan[]): LoanPerformanceData[] => {
    if (loans.length === 0) return generateEmptyPerformanceData();
    
    // For simplicity, we'll generate performance data based on loan status
    // In a real app, this would come from actual payment history
    
    // Get last 6 months 
    const months = getRecentMonths(6);
    
    return months.map(month => {
      // Using actual loan data instead of random generation
      // This is a simplified calculation based on available loan data
      const relevantLoans = loans.filter(loan => {
        const loanMonth = new Date(loan.created_at).toLocaleString('default', { month: 'short' });
        return loanMonth === month;
      });
      
      // Default to zeros if no loans in this month
      if (relevantLoans.length === 0) {
        return {
          month,
          onTime: 0,
          late: 0,
          default: 0
        };
      }
      
      // Calculate based on loan status
      const onTime = relevantLoans.filter(l => l.status === 'active' || l.status === 'completed').length;
      const late = relevantLoans.filter(l => l.status === 'late').length;
      const defaultCount = relevantLoans.filter(l => l.status === 'defaulted').length;
      
      return {
        month,
        onTime,
        late,
        default: defaultCount
      };
    });
  };
  
  // Generate risk distribution based on actual loans
  const generateRiskDistribution = (loans: UserLoan[]): RiskDistribution[] => {
    if (loans.length === 0) return generateEmptyRiskDistribution();
    
    // Categorize loans by interest rate to determine risk level
    const lowRiskLoans = loans.filter(loan => loan.interest_rate < 5).length;
    const mediumRiskLoans = loans.filter(loan => loan.interest_rate >= 5 && loan.interest_rate < 10).length;
    const highRiskLoans = loans.filter(loan => loan.interest_rate >= 10).length;
    
    const total = loans.length;
    
    return [
      { 
        name: "Low Risk", 
        value: total > 0 ? Math.round((lowRiskLoans / total) * 100) : 0, 
        color: "#22c55e" 
      },
      { 
        name: "Medium Risk", 
        value: total > 0 ? Math.round((mediumRiskLoans / total) * 100) : 0, 
        color: "#f59e0b" 
      },
      { 
        name: "High Risk", 
        value: total > 0 ? Math.round((highRiskLoans / total) * 100) : 0, 
        color: "#ef4444" 
      }
    ];
  };
  
  // Generate loan type distribution
  const generateLoanTypeDistribution = (loans: UserLoan[]): LoanTypeData[] => {
    if (loans.length === 0) return generateEmptyLoanTypeData();
    
    // Count loans by purpose
    const purposeCounts: Record<string, number> = {};
    
    loans.forEach(loan => {
      const purpose = loan.purpose || 'Other';
      purposeCounts[purpose] = (purposeCounts[purpose] || 0) + 1;
    });
    
    // Convert to array format for chart
    return Object.entries(purposeCounts).map(([type, count]) => ({
      type,
      count
    }));
  };
  
  // Generate trends data
  const generateTrendsData = (loans: UserLoan[]): TrendData[] => {
    if (loans.length === 0) return generateEmptyTrendsData();
    
    // Group loans by month and sum amounts
    const monthlyAmounts: Record<string, number> = {};
    
    // Get last 6 months
    const months = getRecentMonths(6);
    months.forEach(month => {
      monthlyAmounts[month] = 0;
    });
    
    loans.forEach(loan => {
      const date = new Date(loan.created_at);
      const monthKey = `${date.toLocaleString('default', { month: 'short' })}`;
      
      if (monthlyAmounts[monthKey] !== undefined) {
        monthlyAmounts[monthKey] += loan.amount;
      }
    });
    
    // Convert to array format for chart
    return months.map(month => ({
      month,
      amount: monthlyAmounts[month] || 0
    }));
  };
  
  // Helper to get recent months
  const getRecentMonths = (count: number): string[] => {
    const months = [];
    const date = new Date();
    
    for (let i = 0; i < count; i++) {
      const d = new Date(date);
      d.setMonth(date.getMonth() - i);
      months.unshift(d.toLocaleString('default', { month: 'short' }));
    }
    
    return months;
  };
  
  // Empty data generators
  const generateEmptyPerformanceData = (): LoanPerformanceData[] => {
    return getRecentMonths(6).map(month => ({
      month,
      onTime: 0,
      late: 0,
      default: 0
    }));
  };
  
  const generateEmptyRiskDistribution = (): RiskDistribution[] => {
    return [
      { name: "Low Risk", value: 0, color: "#22c55e" },
      { name: "Medium Risk", value: 0, color: "#f59e0b" },
      { name: "High Risk", value: 0, color: "#ef4444" }
    ];
  };
  
  const generateEmptyLoanTypeData = (): LoanTypeData[] => {
    return [
      { type: "Personal", count: 0 },
      { type: "Business", count: 0 },
      { type: "Education", count: 0 }
    ];
  };
  
  const generateEmptyTrendsData = (): TrendData[] => {
    return getRecentMonths(6).map(month => ({
      month,
      amount: 0
    }));
  };

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium text-center">Wallet Not Connected</h3>
            <p className="text-muted-foreground text-center mt-2">
              Connect your wallet to view loan analytics and performance data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-medium text-center">Loading Your Analytics</h3>
            <p className="text-muted-foreground text-center mt-2">
              Please wait while we fetch your personal loan data...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-trustbond-primary/5 to-trustbond-secondary/5 p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-trustbond-dark">Your Loan Analytics</h2>
        <p className="text-muted-foreground">
          Monitor your personal loan performance and portfolio analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-l-4 border-l-trustbond-primary hover:shadow transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-trustbond-primary" />
              Active Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold my-2">{totalActiveLoans}</div>
            <p className="text-sm text-muted-foreground">
              Your current active loans
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-trustbond-secondary hover:shadow transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-trustbond-secondary" />
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold my-2">{portfolioValue} ETH</div>
            <p className="text-sm text-muted-foreground">
              Total value of your active loans
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-green-500 hover:shadow transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Repayment Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold my-2">{repaymentRate}%</div>
            <p className="text-sm text-muted-foreground">
              Your loan completion rate
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-amber-500 hover:shadow transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Default Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold my-2">{defaultRate}%</div>
            <p className="text-sm text-muted-foreground">
              Your loan default rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 shadow-sm border-l-4 border-l-trustbond-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-trustbond-primary" />
                  Your Loan Performance
                </CardTitle>
                <CardDescription>
                  Monthly repayment performance history
                </CardDescription>
              </div>
              <div className="flex space-x-2 text-sm">
                <button 
                  className={`px-2 py-1 rounded ${timeframe === "1m" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  onClick={() => setTimeframe("1m")}
                >
                  1M
                </button>
                <button 
                  className={`px-2 py-1 rounded ${timeframe === "3m" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  onClick={() => setTimeframe("3m")}
                >
                  3M
                </button>
                <button 
                  className={`px-2 py-1 rounded ${timeframe === "6m" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  onClick={() => setTimeframe("6m")}
                >
                  6M
                </button>
                <button 
                  className={`px-2 py-1 rounded ${timeframe === "1y" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  onClick={() => setTimeframe("1y")}
                >
                  1Y
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {performanceData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground">No loan performance data available yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={performanceData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="onTime"
                    stackId="1"
                    stroke="#22c55e"
                    fill="#22c55e"
                    name="On Time"
                  />
                  <Area
                    type="monotone"
                    dataKey="late"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    name="Late"
                  />
                  <Area
                    type="monotone"
                    dataKey="default"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    name="Default"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm border-l-4 border-l-trustbond-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="h-5 w-5 text-trustbond-secondary" />
              Your Risk Distribution
            </CardTitle>
            <CardDescription>
              Personal portfolio risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {riskDistribution.every(item => item.value === 0) ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground">No risk distribution data available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col justify-center space-y-2">
                  {riskDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Your Risk Score:</span>
                    <span className="font-bold">
                      {riskDistribution[0].value > 60 ? "72/100" : 
                       riskDistribution[1].value > 60 ? "58/100" : "42/100"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-trustbond-dark">Detailed Analysis</h2>
          <TabsList className="w-auto">
            <TabsTrigger value="distribution">Loan Distribution</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="distribution" className="mt-4">
          <Card className="shadow-sm border-l-4 border-l-trustbond-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart2 className="h-5 w-5 text-trustbond-accent" />
                Your Loan Type Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of your loans by purpose category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loanTypeData.every(item => item.count === 0) ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-muted-foreground">No loan distribution data available yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={loanTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="mt-4">
          <Card className="shadow-sm border-l-4 border-l-trustbond-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-trustbond-accent" />
                Your Monthly Borrowing
              </CardTitle>
              <CardDescription>
                Total value of loans you've borrowed per month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trendsData.every(item => item.amount === 0) ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-muted-foreground">No monthly trends data available yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} ETH`, "Amount"]} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
