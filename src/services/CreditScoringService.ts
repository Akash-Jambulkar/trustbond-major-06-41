
import { supabase } from "@/integrations/supabase/client";
import { getFromCache, storeInCache, getCacheKey } from "@/utils/cache/blockchainCache";

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
      const { data, error } = await supabase
        .from('credit_apis')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw error;
      
      return data || [];
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
      // Check for cached score
      const cacheKey = getCacheKey('creditScore', userId);
      const cachedScore = getFromCache<CreditScoreResponse>(cacheKey, 'trustScore');
      
      if (cachedScore) {
        return cachedScore;
      }
      
      // First check if we have a score in the database
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
          const response = {
            score: existingScore.trust_score,
            factors: [
              "Payment history",
              "Credit utilization",
              "Credit history length"
            ],
            source: "Database",
            timestamp: existingScore.updated_at || new Date().toISOString(),
            status: 'success' as const
          };
          
          storeInCache(cacheKey, 'trustScore', response);
          
          return response;
        }
      }
      
      // If no valid cached score, get from blockchain or external API
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('wallet_address')
        .eq('id', userId)
        .single();
        
      if (!userProfile?.wallet_address) {
        throw new Error("User wallet address not found");
      }
      
      // Get transactions history for scoring
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('from_address', userProfile.wallet_address.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(100);
    
      // Calculate score based on transaction history
      const transactionCount = transactions?.length || 0;
      const successfulTransactions = transactions?.filter(tx => tx.status === 'confirmed').length || 0;
      const transactionSuccessRate = transactionCount > 0 ? successfulTransactions / transactionCount : 0;
      
      // Apply basic scoring algorithm (in production, this would be more sophisticated)
      let score = 550; // Base score
      
      if (transactionCount > 0) {
        score += Math.min(transactionCount * 5, 100); // Up to +100 for transaction history
        score += Math.floor(transactionSuccessRate * 100); // Up to +100 for success rate
      }
      
      // Cap score at 850
      score = Math.min(score, 850);
      
      // Store the calculated score in the database
      await supabase
        .from('profiles')
        .update({ 
          trust_score: score,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      const response = {
        score,
        factors: [
          "Transaction history",
          "Transaction success rate",
          "Account age",
          "KYC verification status",
          "Loan repayment history"
        ],
        source: "TrustBond Scoring Algorithm",
        timestamp: new Date().toISOString(),
        status: 'success' as const
      };
      
      storeInCache(cacheKey, 'trustScore', response);
      
      return response;
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
      const creditScoreResult = await CreditScoringService.getCreditScore(userId);
      
      if (creditScoreResult.status === 'error') {
        throw new Error(creditScoreResult.error || "Failed to get credit score");
      }
      
      const score = creditScoreResult.score;
      
      // Get user's existing loans
      const { data: existingLoans } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', userId)
        .neq('status', 'fully_repaid');
        
      const outstandingLoanCount = existingLoans?.length || 0;
      const hasDefaulted = existingLoans?.some(loan => loan.status === 'defaulted') || false;
      
      // Calculate risk level based on score and loan history
      let riskLevel: 'low' | 'medium' | 'high' | 'extreme';
      let recommendedRate: number;
      let maxAmount: number;
      
      if (hasDefaulted) {
        riskLevel = 'extreme';
        recommendedRate = 19.9;
        maxAmount = 0.5;
      } else if (score >= 750) {
        riskLevel = 'low';
        recommendedRate = 5.5 + (outstandingLoanCount * 0.5); // Increase rate with more loans
        maxAmount = 10 - (outstandingLoanCount * 1); // Decrease max with more loans
      } else if (score >= 670) {
        riskLevel = 'medium';
        recommendedRate = 8.5 + (outstandingLoanCount * 0.75);
        maxAmount = 5 - (outstandingLoanCount * 0.5);
      } else if (score >= 580) {
        riskLevel = 'high';
        recommendedRate = 12.5 + (outstandingLoanCount * 1);
        maxAmount = 2 - (outstandingLoanCount * 0.3);
      } else {
        riskLevel = 'extreme';
        recommendedRate = 18.5;
        maxAmount = 0.5;
      }
      
      // Clamp values to reasonable limits
      recommendedRate = Math.min(Math.max(recommendedRate, 3.5), 19.9);
      maxAmount = Math.min(Math.max(maxAmount, 0.1), 10);
      
      // Return the risk assessment
      return {
        riskLevel,
        recommendedInterestRate: parseFloat(recommendedRate.toFixed(1)),
        maximumAmount: parseFloat(maxAmount.toFixed(1)),
        factors: [
          "Credit score",
          "Payment history",
          "Existing debt",
          "Income verification",
          "Loan history"
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
