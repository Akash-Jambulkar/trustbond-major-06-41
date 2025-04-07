import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Search, Eye, FileText, Download, LineChart, BarChart2, PieChart } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";
import { toast } from "sonner";

// Trust score type definition
type TrustScore = {
  id: number;
  userId: string;
  userName: string;
  score: number;
  loanEligibility: "HIGH" | "MODERATE" | "LOW";
  scoringDate: string;
  breakdown: {
    cibil_score: number;
    pending_loans: number;
    debt_to_income_ratio: number;
    credit_utilization: number;
    employment_stability: number;
    current_family_income: number;
    savings_fixed_deposits: number;
  };
  history: { month: string; score: number }[];
};

// Mock trust score data
const mockTrustScores: TrustScore[] = [
  {
    id: 1,
    userId: "USR-001",
    userName: "John Doe",
    score: 780,
    loanEligibility: "HIGH",
    scoringDate: "2025-03-25",
    breakdown: {
      cibil_score: 800,
      pending_loans: 100000,
      debt_to_income_ratio: 0.25,
      credit_utilization: 0.30,
      employment_stability: 5,
      current_family_income: 1800000,
      savings_fixed_deposits: 1000000
    },
    history: [
      { month: 'Jan', score: 770 },
      { month: 'Feb', score: 775 },
      { month: 'Mar', score: 780 }
    ]
  },
  {
    id: 2,
    userId: "USR-002",
    userName: "Jane Smith",
    score: 820,
    loanEligibility: "HIGH",
    scoringDate: "2025-03-20",
    breakdown: {
      cibil_score: 850,
      pending_loans: 50000,
      debt_to_income_ratio: 0.15,
      credit_utilization: 0.20,
      employment_stability: 8,
      current_family_income: 2500000,
      savings_fixed_deposits: 1500000
    },
    history: [
      { month: 'Jan', score: 800 },
      { month: 'Feb', score: 810 },
      { month: 'Mar', score: 820 }
    ]
  },
  {
    id: 3,
    userId: "USR-003",
    userName: "Robert Johnson",
    score: 750,
    loanEligibility: "MODERATE",
    scoringDate: "2025-03-15",
    breakdown: {
      cibil_score: 750,
      pending_loans: 300000,
      debt_to_income_ratio: 0.35,
      credit_utilization: 0.40,
      employment_stability: 3,
      current_family_income: 1500000,
      savings_fixed_deposits: 500000
    },
    history: [
      { month: 'Jan', score: 730 },
      { month: 'Feb', score: 740 },
      { month: 'Mar', score: 750 }
    ]
  },
  {
    id: 4,
    userId: "USR-004",
    userName: "Sarah Wilson",
    score: 620,
    loanEligibility: "LOW",
    scoringDate: "2025-03-10",
    breakdown: {
      cibil_score: 650,
      pending_loans: 800000,
      debt_to_income_ratio: 0.55,
      credit_utilization: 0.65,
      employment_stability: 2,
      current_family_income: 900000,
      savings_fixed_deposits: 200000
    },
    history: [
      { month: 'Jan', score: 600 },
      { month: 'Feb', score: 610 },
      { month: 'Mar', score: 620 }
    ]
  },
  {
    id: 5,
    userId: "USR-005",
    userName: "Michael Brown",
    score: 710,
    loanEligibility: "MODERATE",
    scoringDate: "2025-03-05",
    breakdown: {
      cibil_score: 720,
      pending_loans: 400000,
      debt_to_income_ratio: 0.40,
      credit_utilization: 0.35,
      employment_stability: 4,
      current_family_income: 1200000,
      savings_fixed_deposits: 400000
    },
    history: [
      { month: 'Jan', score: 690 },
      { month: 'Feb', score: 700 },
      { month: 'Mar', score: 710 }
    ]
  }
];

// Aggregate data for distribution chart
const scoreDistribution = [
  { range: "800-850", count: 1, color: "#10b981" },
  { range: "750-799", count: 2, color: "#3b82f6" },
  { range: "700-749", count: 1, color: "#6366f1" },
  { range: "650-699", count: 0, color: "#f59e0b" },
  { range: "600-649", count: 1, color: "#ef4444" }
];

const BankTrustScores = () => {
  const [trustScores, setTrustScores] = useState<TrustScore[]>(mockTrustScores);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScore, setSelectedScore] = useState<TrustScore | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [chartType, setChartType] = useState<"history" | "breakdown">("history");
  const { enableBlockchain } = useMode();

  // Filter trust scores based on search
  const filteredScores = trustScores.filter(score => 
    score.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    score.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (score: TrustScore) => {
    setSelectedScore(score);
    setIsDetailsDialogOpen(true);
  };

  const handleExportTrustScore = () => {
    toast.success("Trust score exported to CSV");
  };

  // Format breakdown data for chart
  const formatBreakdownData = (breakdown: TrustScore["breakdown"]) => {
    return [
      { factor: "CIBIL Score", value: breakdown.cibil_score / 10, color: "#10b981" },
      { factor: "Pending Loans", value: 100 - (breakdown.pending_loans / 10000), color: "#3b82f6" },
      { factor: "DTI Ratio", value: 100 - (breakdown.debt_to_income_ratio * 100), color: "#6366f1" },
      { factor: "Credit Usage", value: 100 - (breakdown.credit_utilization * 100), color: "#f59e0b" },
      { factor: "Employment", value: breakdown.employment_stability * 10, color: "#8b5cf6" },
      { factor: "Family Income", value: breakdown.current_family_income / 30000, color: "#ec4899" },
      { factor: "Savings", value: breakdown.savings_fixed_deposits / 20000, color: "#14b8a6" }
    ];
  };

  // Create chart configuration for both charts
  const chartConfig = {
    score: { label: "Score", color: "#3b82f6" },
    count: { label: "Users", color: "#3b82f6" },
    value: { label: "Value", color: "#3b82f6" }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Trust Scores</h1>
        <div className="flex gap-2">
          {enableBlockchain && (
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Blockchain Records
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Distribution of trust scores across users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scoreDistribution}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="font-medium">Range:</div>
                                <div>{payload[0].payload.range}</div>
                                <div className="font-medium">Users:</div>
                                <div>{payload[0].payload.count}</div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" name="Users" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trust Score Overview</CardTitle>
            <CardDescription>Average scores and eligibility metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-md border p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(trustScores.reduce((acc, score) => acc + score.score, 0) / trustScores.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Score</div>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {trustScores.filter(score => score.loanEligibility === "HIGH").length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Eligibility</div>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {trustScores.filter(score => score.loanEligibility === "LOW").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Low Eligibility</div>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-2">Score Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Highest Score:</span>
                    <span className="font-medium">{Math.max(...trustScores.map(s => s.score))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Lowest Score:</span>
                    <span className="font-medium">{Math.min(...trustScores.map(s => s.score))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Scores Generated:</span>
                    <span className="font-medium">{trustScores.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Trust Score Records</CardTitle>
          <CardDescription>View and analyze user trust scores</CardDescription>
          <div className="relative sm:max-w-xs mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Loan Eligibility</TableHead>
                  <TableHead>Scoring Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No trust scores found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredScores.map((score) => (
                    <TableRow key={score.id}>
                      <TableCell>{score.userName}</TableCell>
                      <TableCell>{score.userId}</TableCell>
                      <TableCell>
                        <div className={`font-medium ${
                          score.score >= 750 ? "text-green-600" : 
                          score.score >= 650 ? "text-amber-600" : 
                          "text-red-600"
                        }`}>
                          {score.score}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${
                          score.loanEligibility === "HIGH" ? "text-green-600" : 
                          score.loanEligibility === "MODERATE" ? "text-amber-600" : 
                          "text-red-600"
                        }`}>
                          {score.loanEligibility}
                        </div>
                      </TableCell>
                      <TableCell>{score.scoringDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(score)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Trust Score Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Trust Score Details</DialogTitle>
            <DialogDescription>
              Detailed analysis of user's trust score
            </DialogDescription>
          </DialogHeader>
          
          {selectedScore && (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold">{selectedScore.userName}</h2>
                  <p className="text-sm text-muted-foreground">User ID: {selectedScore.userId}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      selectedScore.score >= 750 ? "text-green-600" : 
                      selectedScore.score >= 650 ? "text-amber-600" : 
                      "text-red-600"
                    }`}>
                      {selectedScore.score}
                    </div>
                    <div className="text-xs text-muted-foreground">Trust Score</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-medium ${
                      selectedScore.loanEligibility === "HIGH" ? "text-green-600" : 
                      selectedScore.loanEligibility === "MODERATE" ? "text-amber-600" : 
                      "text-red-600"
                    }`}>
                      {selectedScore.loanEligibility}
                    </div>
                    <div className="text-xs text-muted-foreground">Loan Eligibility</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 border-t border-b py-2">
                <Button 
                  variant={chartType === "history" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType("history")}
                  className="gap-1"
                >
                  <LineChart className="h-4 w-4" />
                  Score History
                </Button>
                <Button 
                  variant={chartType === "breakdown" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType("breakdown")}
                  className="gap-1"
                >
                  <BarChart2 className="h-4 w-4" />
                  Score Breakdown
                </Button>
              </div>
              
              <div className="h-72">
                <ChartContainer config={chartConfig}>
                  {chartType === "history" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={selectedScore.history}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[
                          Math.floor(Math.min(...selectedScore.history.map(h => h.score)) / 50) * 50,
                          Math.ceil(Math.max(...selectedScore.history.map(h => h.score)) / 50) * 50
                        ]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={formatBreakdownData(selectedScore.breakdown)}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis type="category" dataKey="factor" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" name="Score Component" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartContainer>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-2">Score Components</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CIBIL Score:</span>
                    <span className="font-medium">{selectedScore.breakdown.cibil_score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Loans:</span>
                    <span className="font-medium">₹{selectedScore.breakdown.pending_loans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">DTI Ratio:</span>
                    <span className="font-medium">{(selectedScore.breakdown.debt_to_income_ratio * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Credit Usage:</span>
                    <span className="font-medium">{(selectedScore.breakdown.credit_utilization * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Employment:</span>
                    <span className="font-medium">{selectedScore.breakdown.employment_stability} years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Annual Income:</span>
                    <span className="font-medium">₹{selectedScore.breakdown.current_family_income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Savings:</span>
                    <span className="font-medium">₹{selectedScore.breakdown.savings_fixed_deposits.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={handleExportTrustScore}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export Score
            </Button>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankTrustScores;
