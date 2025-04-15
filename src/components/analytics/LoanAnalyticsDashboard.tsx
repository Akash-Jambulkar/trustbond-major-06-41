
import React, { useState } from "react";
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
import { BarChart2, PieChart as PieChartIcon, TrendingUp, AlertTriangle } from "lucide-react";

// Sample data - in production this would come from blockchain
const performanceData = [
  { month: "Jan", onTime: 85, late: 10, default: 5 },
  { month: "Feb", onTime: 82, late: 13, default: 5 },
  { month: "Mar", onTime: 88, late: 9, default: 3 },
  { month: "Apr", onTime: 90, late: 7, default: 3 },
  { month: "May", onTime: 92, late: 6, default: 2 },
  { month: "Jun", onTime: 91, late: 7, default: 2 },
];

const riskDistribution = [
  { name: "Low Risk", value: 65, color: "#22c55e" },
  { name: "Medium Risk", value: 25, color: "#f59e0b" },
  { name: "High Risk", value: 10, color: "#ef4444" },
];

const loanTypeData = [
  { type: "Personal", count: 45 },
  { type: "Business", count: 30 },
  { type: "Education", count: 15 },
  { type: "Home", count: 25 },
  { type: "Debt", count: 20 },
  { type: "Medical", count: 10 },
  { type: "Other", count: 5 },
];

const trendsData = [
  { month: "Jan", amount: 120000 },
  { month: "Feb", amount: 135000 },
  { month: "Mar", amount: 160000 },
  { month: "Apr", amount: 180000 },
  { month: "May", amount: 210000 },
  { month: "Jun", amount: 240000 },
];

export const LoanAnalyticsDashboard: React.FC = () => {
  const { isConnected } = useBlockchain();
  const [timeframe, setTimeframe] = useState<"1m" | "3m" | "6m" | "1y">("6m");

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Loan Analytics</h2>
        <p className="text-muted-foreground">
          Monitor loan performance and portfolio risk assessment in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">157</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.45 ETH</div>
            <p className="text-xs text-muted-foreground">
              +7.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repayment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.3%</div>
            <p className="text-xs text-muted-foreground">
              +1.8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.7%</div>
            <p className="text-xs text-green-600 font-medium">
              -0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Loan Performance
                </CardTitle>
                <CardDescription>
                  Monthly repayment performance analysis
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
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Risk Distribution
            </CardTitle>
            <CardDescription>
              Portfolio risk assessment breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  <span className="font-medium">Risk Score:</span>
                  <span className="font-bold">72/100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="distribution">Loan Distribution</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Loan Type Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of loans by purpose category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={loanTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Lending Volume
              </CardTitle>
              <CardDescription>
                Total value of loans issued per month
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
