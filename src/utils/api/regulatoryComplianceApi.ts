
import { toast } from "sonner";

// Types for regulatory compliance data
export interface ComplianceCheckResult {
  status: 'passed' | 'failed' | 'pending';
  checkDate: string;
  details: {
    checkName: string;
    result: 'pass' | 'fail' | 'pending';
    description: string;
  }[];
  summary: string;
  nextReviewDate: string | null;
  riskLevel: 'low' | 'medium' | 'high';
}

// Integration with external regulatory compliance service
export const performComplianceCheck = async (userId: string): Promise<ComplianceCheckResult> => {
  try {
    // In production, this would be a real API call to a compliance service
    // For now, we'll simulate a response with a timeout
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simple logic to generate random but consistent results based on user ID
    const userHash = hashString(userId);
    const passed = userHash % 10 > 1; // 80% pass rate for demonstration
    const riskLevel = determineRiskLevel(userHash);
    
    // Generate a compliance check result
    const response: ComplianceCheckResult = {
      status: passed ? 'passed' : (userHash % 2 === 0 ? 'failed' : 'pending'),
      checkDate: new Date().toISOString(),
      details: generateComplianceDetails(userHash),
      summary: passed 
        ? "All regulatory compliance checks have passed." 
        : "Some compliance checks require attention.",
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
      riskLevel
    };
    
    return response;
  } catch (error) {
    console.error("Error performing compliance check:", error);
    toast.error("Failed to perform regulatory compliance check");
    throw error;
  }
};

// Helper function to hash a string (reused from creditScoreApi)
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Determine risk level based on user hash
const determineRiskLevel = (hash: number): 'low' | 'medium' | 'high' => {
  const value = hash % 100;
  if (value < 70) return 'low';
  if (value < 90) return 'medium';
  return 'high';
};

// Generate compliance check details
const generateComplianceDetails = (hash: number) => {
  const baseChecks = [
    {
      checkName: "Anti-Money Laundering (AML)",
      result: hash % 10 > 1 ? 'pass' as const : 'fail' as const,
      description: "Verification of customer identity and transaction patterns against AML regulations."
    },
    {
      checkName: "Know Your Customer (KYC)",
      result: hash % 8 > 0 ? 'pass' as const : 'pending' as const,
      description: "Verification of customer identity documentation and information."
    },
    {
      checkName: "Politically Exposed Person (PEP)",
      result: 'pass' as const,
      description: "Check against PEP databases for high-risk individuals."
    },
    {
      checkName: "Sanctions Screening",
      result: hash % 15 > 0 ? 'pass' as const : 'fail' as const,
      description: "Screening against global sanctions lists including OFAC, UN, and EU."
    },
    {
      checkName: "Adverse Media Screening",
      result: hash % 5 > 0 ? 'pass' as const : 'pending' as const,
      description: "Scanning for negative news or articles related to the customer."
    }
  ];
  
  return baseChecks;
};
