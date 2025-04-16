
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { DashboardMetric } from "./types";
import { ShieldCheck, ChartBar, CreditCard, CheckCircle } from "lucide-react";

export const useBankMetrics = () => {
  const { isConnected, account } = useBlockchain();
  
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadBankMetrics = async () => {
      if (!isConnected || !account) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, these would be fetched from API/blockchain
        const bankMetrics: DashboardMetric[] = [
          {
            title: "Pending KYC",
            value: 12,
            change: "+3 today",
            icon: <ShieldCheck className="h-4 w-4 text-amber-600" />,
            status: "up"
          },
          {
            title: "Active Loans",
            value: 128,
            change: "+8 this week",
            icon: <CreditCard className="h-4 w-4 text-purple-600" />,
            status: "up"
          },
          {
            title: "Loan Volume",
            value: "245.8 ETH",
            change: "+12.4 ETH this month",
            icon: <ChartBar className="h-4 w-4 text-blue-600" />,
            status: "up"
          },
          {
            title: "KYC Success Rate",
            value: "94%",
            change: "+2% this month",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            status: "up"
          }
        ];
        
        setMetrics(bankMetrics);
      } catch (error) {
        console.error("Error loading bank metrics:", error);
        setError("Failed to load bank metrics");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBankMetrics();
  }, [isConnected, account]);
  
  return { metrics, isLoading, error, setMetrics };
};
