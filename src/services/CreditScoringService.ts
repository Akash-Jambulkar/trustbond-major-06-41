import { supabase } from "@/integrations/supabase/client";

// Mock data for regulatory compliance API
const MOCK_CREDIT_APIS = [
  {
    name: "Credit Bureau API",
    endpoint: "https://api.creditbureau.example",
    description: "Official credit bureau scoring API",
    isActive: true
  },
  {
    name: "International Risk Assessment",
    endpoint: "https://api.riskassessment.example",
    description: "Global risk assessment database",
    isActive: false
  },
  {
    name: "Blockchain Identity Verification",
    endpoint: "https://api.blockchainid.example",
    description: "Cross-chain identity verification",
    isActive: true
  }
];

interface CreditScoreResponse {
  score: number; 
  factors: string[];
  reportData?: any;
  source: string;
  timestamp: string;
  status: 'success' | 'error';
  error?: string;
}

interface LoanRiskResponse {
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  recommendedInterestRate: number;
  maximumAmount: number;
  factors: string[];
  status: 'success' | 'error';
  error?: string;
}

export const CreditScoringService = {
  /**
   * Get available credit scoring APIs
   */
  getAvailableApis: async () => {
    try {
      // In a real app, fetch from supabase
      return MOCK_CREDIT_APIS;
    } catch (error) {
      console.error("Error fetching credit APIs:", error);
      return [];
    }
  },
  
  /**
   * Get credit score from the credit bureau API
   */
  getCreditScore: async (userId: string): Promise<CreditScoreResponse> => {
    try {
      // First check if we have a cached score in the database
      const { data: existingScore } = await supabase
        .from('profiles')
        .select('trust_score, updated_at')
        .eq('id', userId)
        .single();
        
      if (existingScore?.trust_score) {
        // If score exists and is less than 30 days old, use it
        const scoreDate = new Date(existingScore.updated_at || Date.now());
        const daysSinceUpdate = (Date.now() - scoreDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceUpdate < 30) {
          return {
            score: existingScore.trust_score,
            factors: [
              "Payment history",
              "Credit utilization",
              "Credit history length"
            ],
            source: "Database cache",
            timestamp: existingScore.updated_at || new Date().toISOString(),
            status: 'success'
          };
        }
      }
      
      // If no cached score or it's old, we would normally call the API
      // For demo purposes, we'll generate a fake score
      const score = Math.floor(Math.random() * 300) + 550; // 550-850
      
      // Store the new score in the database
      await supabase
        .from('profiles')
        .update({ 
          trust_score: score,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      return {
        score,
        factors: [
          "Payment history",
          "Credit utilization",
          "Credit history length",
          "New credit applications",
          "Credit mix"
        ],
        source: "Credit Bureau API",
        timestamp: new Date().toISOString(),
        status: 'success'
      };
    } catch (error) {
      console.error("Error getting credit score:", error);
      return {
        score: 0,
        factors: [],
        source: "Error",
        timestamp: new Date().toISOString(),
        status: 'error',
        error: String(error)
      };
    }
  },
  
  /**
   * Assess loan risk based on user data
   */
  assessLoanRisk: async (userId: string, amount: number): Promise<LoanRiskResponse> => {
    try {
      // Get user credit score
      const creditScoreResult = await this.getCreditScore(userId);
      
      if (creditScoreResult.status === 'error') {
        throw new Error(creditScoreResult.error || "Failed to get credit score");
      }
      
      const score = creditScoreResult.score;
      
      // Calculate risk level based on score
      let riskLevel: 'low' | 'medium' | 'high' | 'extreme';
      let recommendedRate: number;
      let maxAmount: number;
      
      if (score >= 750) {
        riskLevel = 'low';
        recommendedRate = 5.5;
        maxAmount = 10;
      } else if (score >= 670) {
        riskLevel = 'medium';
        recommendedRate = 8.5;
        maxAmount = 5;
      } else if (score >= 580) {
        riskLevel = 'high';
        recommendedRate = 12.5;
        maxAmount = 2;
      } else {
        riskLevel = 'extreme';
        recommendedRate = 18.5;
        maxAmount = 0.5;
      }
      
      // Return the risk assessment
      return {
        riskLevel,
        recommendedInterestRate: recommendedRate,
        maximumAmount: Math.min(maxAmount, amount * 2),
        factors: [
          "Credit score",
          "Payment history",
          "Existing debt",
          "Income verification"
        ],
        status: 'success'
      };
    } catch (error) {
      console.error("Error assessing loan risk:", error);
      return {
        riskLevel: 'extreme',
        recommendedInterestRate: 0,
        maximumAmount: 0,
        factors: [],
        status: 'error',
        error: String(error)
      };
    }
  }
};

export default CreditScoringService;
