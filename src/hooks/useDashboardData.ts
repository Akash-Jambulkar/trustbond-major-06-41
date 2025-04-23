
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export type KYCStatusType = 'pending' | 'verified' | 'not_submitted' | 'rejected' | 'not_verified';

export const useDashboardData = () => {
  const { 
    isConnected, 
    account,
    kycStatus: blockchainKycStatus
  } = useBlockchain();

  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [activeLoans, setActiveLoans] = useState<number>(0);
  const [kycStatus, setKycStatus] = useState<KYCStatusType>('not_submitted');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get user session data using the correct property
        const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
        
        if (sessionError || !sessionData.user) {
          console.error("Error fetching user session:", sessionError);
          setIsLoading(false);
          return;
        }

        const userId = sessionData.user.id;
        
        // Get profile data including KYC status and trust score
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('kyc_status, trust_score')
          .eq('user_id', userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile data:", profileError);
          setError("Failed to fetch profile data");
        } else if (profileData) {
          setTrustScore(profileData.trust_score || null);
          setKycStatus(profileData.kyc_status as KYCStatusType || 'not_submitted');
        }

        // Get active loans count
        const { data: loansData, error: loansError } = await supabase
          .from('loans')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'active');

        if (loansError) {
          console.error("Error fetching loans data:", loansError);
          setError("Failed to fetch loans data");
        } else {
          setActiveLoans(loansData.length);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data");
        toast.error("Error loading dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isConnected, account]);

  // If blockchain KYC status is available, use it (for real-time updates)
  const finalKycStatus: KYCStatusType = 
    blockchainKycStatus === 'not_verified' ? 'not_submitted' :
    blockchainKycStatus === 'verified' ? 'verified' :
    blockchainKycStatus === 'rejected' ? 'rejected' : 
    kycStatus || 'not_submitted';

  return {
    kycStatus: finalKycStatus,
    trustScore,
    activeLoans,
    isLoading,
    error
  };
};
