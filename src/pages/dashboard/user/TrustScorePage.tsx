import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";

// Trust Score Configuration
const PARAMETER_THRESHOLDS = {
  cibil_score: [[800, 900, "Excellent"], [750, 799, "Good"], [650, 749, "Moderate"], [550, 649, "Low"], [300, 549, "Poor"]],
  debt_to_income_ratio: [[0, 0.2, "Excellent"], [0.21, 0.35, "Good"], [0.36, 0.5, "Moderate"], [0.51, 0.7, "Low"], [0.71, 1, "Poor"]],
  pending_loans: [[0, 250000, "Excellent"], [250001, 750000, "Good"], [750001, 1500000, "Moderate"], [1500001, 3000000, "Low"], [3000001, 5000000, "Poor"]],
  credit_utilization: [[0, 0.2, "Excellent"], [0.21, 0.35, "Good"], [0.36, 0.5, "Moderate"], [0.51, 0.7, "Low"], [0.71, 1, "Poor"]],
  itr_paid: [[1500000, 2000000, "Excellent"], [1000000, 1499999, "Good"], [500000, 999999, "Moderate"], [250000, 499999, "Low"], [10000, 249999, "Poor"]],
  current_family_income: [[3000000, 5000000, "Excellent"], [2000000, 2999999, "Good"], [1000000, 1999999, "Moderate"], [500000, 999999, "Low"], [100000, 499999, "Poor"]],
  employment_stability: [[10, 30, "Excellent"], [5, 9, "Good"], [3, 4, "Moderate"], [1, 2, "Low"], [0, 0, "Poor"]],
  savings_fixed_deposits: [[2000000, 5000000, "Excellent"], [1000000, 1999999, "Good"], [500000, 999999, "Moderate"], [100000, 499999, "Low"], [10000, 99999, "Poor"]],
  loan_inquiry_frequency: [[0, 1, "Excellent"], [2, 3, "Good"], [4, 6, "Moderate"], [7, 10, "Low"], [11, 20, "Poor"]],
  insurance_premium_payments: [[1, 1, "Excellent"], [0.75, 0.99, "Good"], [0.5, 0.74, "Moderate"], [0.25, 0.49, "Low"], [0, 0.24, "Poor"]],
  litigation_history: [[0, 0, "Excellent"], [1, 1, "Good"], [2, 2, "Moderate"], [3, 3, "Low"], [4, 4, "Poor"]],
  tax_compliance: [[0, 0, "Excellent"], [1, 1, "Good"], [2, 2, "Moderate"], [3, 3, "Low"], [4, 4, "Poor"]],
  education_level: [[5, 5, "Excellent"], [4, 4, "Good"], [3, 3, "Moderate"], [2, 2, "Low"], [1, 1, "Poor"]],
  location_cost_of_living: [[1, 1, "Excellent"], [2, 2, "Good"], [3, 3, "Moderate"], [4, 4, "Low"], [5, 5, "Poor"]],
  family_dependents: [[0, 1, "Excellent"], [2, 3, "Good"], [4, 5, "Moderate"], [6, 7, "Low"], [8, 10, "Poor"]]
};

const LOAN_WEIGHTS = {
  home: {
    cibil_score: 12, pending_loans: 10, debt_to_income_ratio: 10, itr_paid: 8,
    employment_stability: 10, current_family_income: 10, savings_fixed_deposits: 10,
    credit_utilization: 8, loan_inquiry_frequency: 4, insurance_premium_payments: 4,
    litigation_history: 4, tax_compliance: 4, education_level: 2, location_cost_of_living: 2, family_dependents: 2
  },
  personal: {
    cibil_score: 14, pending_loans: 12, debt_to_income_ratio: 12, credit_utilization: 10,
    loan_inquiry_frequency: 8, itr_paid: 8, employment_stability: 8, current_family_income: 6,
    savings_fixed_deposits: 4, insurance_premium_payments: 4, litigation_history: 4, tax_compliance: 4,
    education_level: 2, location_cost_of_living: 2, family_dependents: 2
  },
  education: {
    cibil_score: 8, pending_loans: 6, debt_to_income_ratio: 6, itr_paid: 8,
    employment_stability: 6, current_family_income: 10, education_level: 14,
    savings_fixed_deposits: 8, loan_inquiry_frequency: 4, insurance_premium_payments: 4,
    litigation_history: 4, tax_compliance: 4, credit_utilization: 6,
    location_cost_of_living: 4, family_dependents: 4
  },
  vehicle: {
    cibil_score: 12, pending_loans: 10, debt_to_income_ratio: 10, itr_paid: 8,
    employment_stability: 10, current_family_income: 10, savings_fixed_deposits: 10,
    credit_utilization: 8, loan_inquiry_frequency: 4, insurance_premium_payments: 4,
    litigation_history: 4, tax_compliance: 4, education_level: 2, location_cost_of_living: 2, family_dependents: 2
  }
};

const CATEGORY_SCORE = {
  "Excellent": 1.0,
  "Good": 0.8,
  "Moderate": 0.6,
  "Low": 0.4,
  "Poor": 0.2
};

// Default values for simulation
const defaultInputs = {
  loanType: "personal",
  cibil_score: 750,
  pending_loans: 200000,
  itr_paid: 1000000,
  current_family_income: 2000000,
  employment_stability: 5,
  savings_fixed_deposits: 1000000,
  loan_inquiry_frequency: 2,
  insurance_premium_payments: 0.8,
  litigation_history: 0,
  tax_compliance: 0,
  education_level: 4,
  location_cost_of_living: 2,
  family_dependents: 2,
  debt_to_income_ratio: 0.3,
  credit_utilization: 0.25,
};

// Historical trust score data for chart
const mockHistoricalData = [
  { month: 'Jan', score: 710 },
  { month: 'Feb', score: 720 },
  { month: 'Mar', score: 715 },
  { month: 'Apr', score: 735 },
  { month: 'May', score: 750 },
  { month: 'Jun', score: 755 },
  { month: 'Jul', score: 765 },
  { month: 'Aug', score: 770 },
  { month: 'Sep', score: 775 },
  { month: 'Oct', score: 780 },
  { month: 'Nov', score: 790 },
  { month: 'Dec', score: 800 },
];

type InputKey = keyof typeof defaultInputs;

const TrustScorePage = () => {
  const [inputs, setInputs] = useState(defaultInputs);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    details: { parameter: string; value: number; category: string; weight: number; contribution: number }[];
    eligibility: string;
  } | null>(null);
  const [historicalData, setHistoricalData] = useState(mockHistoricalData);
  const { trustScoreContract, account, isConnected } = useBlockchain();

  // Fetch trust score from blockchain if connected
  useEffect(() => {
    const fetchBlockchainScore = async () => {
      if (isConnected && trustScoreContract && account) {
        try {
          // This would be replaced with actual contract call
          // const score = await trustScoreContract.calculateScore(account);
          // console.log("Score from blockchain:", score);
          
          // For demo, we'll just use our local calculation
          calculateScore();
        } catch (error) {
          console.error("Error fetching trust score:", error);
          toast.error("Failed to fetch trust score from blockchain");
        }
      }
    };

    fetchBlockchainScore();
  }, [isConnected, trustScoreContract, account]);

  const handleInputChange = (key: InputKey, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculateScore = () => {
    const loanType = inputs.loanType as keyof typeof LOAN_WEIGHTS;
    const weights = LOAN_WEIGHTS[loanType];
    let totalScore = 0;
    
    const details: { parameter: string; value: number; category: string; weight: number; contribution: number }[] = [];

    for (const [param, value] of Object.entries(inputs)) {
      if (param === 'loanType') continue;
      
      const thresholds = PARAMETER_THRESHOLDS[param as keyof typeof PARAMETER_THRESHOLDS];
      if (!thresholds) continue;

      const numValue = Number(value);
      let categoryLabel = "Poor"; // Default
      
      for (const [lower, upper, label] of thresholds) {
        const lowerValue = Number(lower);
        const upperValue = Number(upper);
        
        if (lowerValue <= numValue && numValue <= upperValue) {
          categoryLabel = label as string;
          break;
        }
      }

      const score = CATEGORY_SCORE[categoryLabel as keyof typeof CATEGORY_SCORE];
      const paramWeight = weights[param as keyof typeof weights] || 0;
      const weightedScore = score * paramWeight;
      totalScore += weightedScore;

      details.push({
        parameter: param.replace('_', ' ').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        value: numValue,
        category: categoryLabel,
        weight: paramWeight,
        contribution: weightedScore
      });
    }

    // Scale to 850 max score (like FICO)
    const scaledScore = Math.round((totalScore / 100) * 850);
    
    let eligibility = "LOW";
    if (totalScore >= 80) {
      eligibility = "HIGH";
    } else if (totalScore >= 60) {
      eligibility = "MODERATE";
    }

    setScoreResult({
      score: scaledScore,
      details,
      eligibility
    });

    // In a real app, we would update this on the blockchain
    // if (trustScoreContract && account) {
    //   trustScoreContract.updateScore(account, scaledScore)
    //     .then(() => toast.success("Trust score updated on blockchain"))
    //     .catch((error) => toast.error("Failed to update trust score on blockchain"));
    // }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trust Score Calculator</h1>
        <Button onClick={calculateScore} className="bg-trustbond-primary">
          Calculate Score
        </Button>
      </div>

      {scoreResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Your Trust Score</CardTitle>
              <CardDescription>Based on your financial profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-5xl font-bold text-trustbond-primary">{scoreResult.score}</div>
                <div className="ml-2">
                  {scoreResult.score > 780 ? (
                    <ArrowUp className="text-green-500" />
                  ) : scoreResult.score < 650 ? (
                    <ArrowDown className="text-red-500" />
                  ) : (
                    <TrendingUp className="text-amber-500" />
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm">
                {scoreResult.score > 780 
                  ? "Excellent credit profile" 
                  : scoreResult.score > 700 
                  ? "Good credit standing" 
                  : scoreResult.score > 650 
                  ? "Fair credit score" 
                  : "Needs improvement"}
              </div>
              <div className="mt-4 p-3 rounded-md bg-gray-50">
                <div className="text-sm font-semibold">Loan Eligibility:</div>
                <div className={`text-lg font-bold ${
                  scoreResult.eligibility === "HIGH" 
                    ? "text-green-600" 
                    : scoreResult.eligibility === "MODERATE" 
                    ? "text-amber-600" 
                    : "text-red-600"
                }`}>
                  {scoreResult.eligibility}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Score History</CardTitle>
              <CardDescription>Last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer 
                  config={{
                    score: {
                      theme: {
                        light: "#9b87f5",
                        dark: "#9b87f5",
                      },
                    },
                  }}
                >
                  <AreaChart
                    data={historicalData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[600, 850]} />
                    <ChartTooltip
                      content={<ChartTooltipContent labelClassName="font-normal" />}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      fill="var(--color-score)"
                      stroke="var(--color-score)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Type & Basic Information</CardTitle>
            <CardDescription>Choose loan type and enter your details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="loanType">Loan Type</Label>
              <Select 
                value={inputs.loanType} 
                onValueChange={(value) => handleInputChange('loanType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Loan</SelectItem>
                  <SelectItem value="personal">Personal Loan</SelectItem>
                  <SelectItem value="education">Education Loan</SelectItem>
                  <SelectItem value="vehicle">Vehicle Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cibil_score">CIBIL Score (300-900)</Label>
              <Input 
                id="cibil_score" 
                type="number" 
                min="300" 
                max="900"
                value={inputs.cibil_score} 
                onChange={(e) => handleInputChange('cibil_score', parseInt(e.target.value))} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="education_level">Education Level (1-5)</Label>
              <Select 
                value={inputs.education_level.toString()} 
                onValueChange={(value) => handleInputChange('education_level', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">PhD (5)</SelectItem>
                  <SelectItem value="4">Post Graduate (4)</SelectItem>
                  <SelectItem value="3">Graduate (3)</SelectItem>
                  <SelectItem value="2">High School (2)</SelectItem>
                  <SelectItem value="1">Primary (1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="employment_stability">Employment Stability (years)</Label>
              <Input 
                id="employment_stability" 
                type="number" 
                min="0" 
                max="30"
                value={inputs.employment_stability} 
                onChange={(e) => handleInputChange('employment_stability', parseInt(e.target.value))} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="family_dependents">Number of Dependents</Label>
              <Input 
                id="family_dependents" 
                type="number" 
                min="0" 
                max="10"
                value={inputs.family_dependents} 
                onChange={(e) => handleInputChange('family_dependents', parseInt(e.target.value))} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
            <CardDescription>Enter your financial details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current_family_income">Annual Family Income (₹)</Label>
              <Input 
                id="current_family_income" 
                type="number"
                min="100000"
                value={inputs.current_family_income} 
                onChange={(e) => handleInputChange('current_family_income', parseInt(e.target.value))} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="itr_paid">Annual ITR Paid (₹)</Label>
              <Input 
                id="itr_paid" 
                type="number"
                min="10000"
                value={inputs.itr_paid} 
                onChange={(e) => handleInputChange('itr_paid', parseInt(e.target.value))} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pending_loans">Pending Loans Amount (₹)</Label>
              <Input 
                id="pending_loans" 
                type="number"
                min="0"
                value={inputs.pending_loans} 
                onChange={(e) => handleInputChange('pending_loans', parseInt(e.target.value))} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="savings_fixed_deposits">Savings & Fixed Deposits (₹)</Label>
              <Input 
                id="savings_fixed_deposits" 
                type="number"
                min="10000"
                value={inputs.savings_fixed_deposits} 
                onChange={(e) => handleInputChange('savings_fixed_deposits', parseInt(e.target.value))} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="debt_to_income_ratio">Debt to Income Ratio (0-1)</Label>
              <Input 
                id="debt_to_income_ratio" 
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={inputs.debt_to_income_ratio} 
                onChange={(e) => handleInputChange('debt_to_income_ratio', parseFloat(e.target.value))} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="credit_utilization">Credit Utilization (0-1)</Label>
              <Input 
                id="credit_utilization" 
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={inputs.credit_utilization} 
                onChange={(e) => handleInputChange('credit_utilization', parseFloat(e.target.value))} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {scoreResult && (
        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
            <CardDescription>Detailed analysis of your trust score calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scoreResult.details.map((detail, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="text-sm font-medium">{detail.parameter}</div>
                  <div className="text-xs text-gray-500">Value: {detail.value}</div>
                  <div className={`text-xs font-semibold ${
                    detail.category === "Excellent" 
                      ? "text-green-600" 
                      : detail.category === "Good" 
                      ? "text-blue-600" 
                      : detail.category === "Moderate" 
                      ? "text-amber-600" 
                      : detail.category === "Low" 
                      ? "text-orange-600" 
                      : "text-red-600"
                  }`}>
                    {detail.category}
                  </div>
                  <div className="text-xs text-gray-500">
                    Weight: {detail.weight}% | Contribution: {detail.contribution.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrustScorePage;
