
import { toast } from "sonner";

// Types for credit score data
export interface CreditScoreResponse {
  score: number;
  maxScore: number;
  minScore: number;
  status: 'poor' | 'fair' | 'good' | 'excellent';
  reportDate: string;
  factors: {
    type: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  recommendations: {
    action: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

// Simulating an API call to an external credit scoring service
export const fetchCreditScore = async (userId: string): Promise<CreditScoreResponse> => {
  try {
    // In production, this would be a real API call
    // For now, we'll simulate a response with a timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate a response based on userId hash
    const userHash = hashString(userId);
    const score = 500 + (userHash % 350); // Score between 500-850
    
    // Generate a response based on the score
    const response: CreditScoreResponse = {
      score,
      maxScore: 850,
      minScore: 300,
      status: getScoreStatus(score),
      reportDate: new Date().toISOString(),
      factors: generateFactors(score),
      recommendations: generateRecommendations(score)
    };
    
    return response;
  } catch (error) {
    console.error("Error fetching credit score:", error);
    toast.error("Failed to fetch credit score");
    throw error;
  }
};

// Helper function to hash a string into a number
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Determine score status based on value
const getScoreStatus = (score: number): 'poor' | 'fair' | 'good' | 'excellent' => {
  if (score < 580) return 'poor';
  if (score < 670) return 'fair';
  if (score < 740) return 'good';
  return 'excellent';
};

// Generate factors affecting credit score
const generateFactors = (score: number) => {
  const baseFactors = [
    {
      type: 'payment_history',
      description: 'Payment History',
      impact: 'high' as const
    },
    {
      type: 'credit_utilization',
      description: 'Credit Utilization',
      impact: 'high' as const
    },
    {
      type: 'credit_age',
      description: 'Length of Credit History',
      impact: 'medium' as const
    },
    {
      type: 'account_mix',
      description: 'Credit Mix',
      impact: 'low' as const
    },
    {
      type: 'recent_inquiries',
      description: 'Recent Credit Inquiries',
      impact: 'low' as const
    }
  ];
  
  return baseFactors;
};

// Generate recommendations based on score
const generateRecommendations = (score: number) => {
  const baseRecommendations = [
    {
      action: 'Make on-time payments',
      impact: 'high' as const,
      description: 'Consistently pay bills on time to improve your payment history.'
    },
    {
      action: 'Reduce credit card balances',
      impact: 'high' as const,
      description: 'Keep credit utilization below 30% of your available credit.'
    },
    {
      action: 'Avoid opening multiple new accounts',
      impact: 'medium' as const,
      description: 'Multiple credit applications can lower your score temporarily.'
    }
  ];
  
  if (score < 670) {
    baseRecommendations.push({
      action: 'Consider a secured credit card',
      impact: 'medium' as const,
      description: 'This can help build credit if you have limited credit history.'
    });
  }
  
  return baseRecommendations;
};
