
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { DashboardMetric } from "./types";
import { CheckCircle, ArrowUpRight, CreditCard, ChartBar } from "lucide-react";

export const useAdminMetrics = () => {
  const { isConnected, account } = useBlockchain();
  
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAdminMetrics = async () => {
      if (!isConnected || !account) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, these would be fetched from API/blockchain
        const adminMetrics: DashboardMetric[] = [
          {
            title: "System Status",
            value: "Operational",
            icon: <CheckCircle size={16} className="text-green-600" />,
            status: "up"
          },
          {
            title: "Active Users",
            value: 156,
            change: "+12 this week",
            icon: <ArrowUpRight size={16} className="text-blue-600" />,
            status: "up"
          },
          {
            title: "Banks Registered",
            value: 8,
            change: "+1 this month",
            icon: <CreditCard size={16} className="text-purple-600" />,
            status: "up"
          },
          {
            title: "Total Transactions",
            value: 12458,
            change: "+234 today",
            icon: <ChartBar size={16} className="text-blue-600" />,
            status: "up"
          }
        ];
        
        setMetrics(adminMetrics);
      } catch (error) {
        console.error("Error loading admin metrics:", error);
        setError("Failed to load admin metrics");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAdminMetrics();
  }, [isConnected, account]);
  
  return { metrics, isLoading, error, setMetrics };
};
