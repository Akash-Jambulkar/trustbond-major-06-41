
import React from "react";
import { DashboardStatsProps } from "./metrics/types";
import { MetricsGrid } from "./metrics/MetricsGrid";
import { useUserMetrics } from "./metrics/useUserMetrics";
import { useBankMetrics } from "./metrics/useBankMetrics";
import { useAdminMetrics } from "./metrics/useAdminMetrics";
import { useMetricsUpdates } from "./metrics/useMetricsUpdates";

export const DashboardStats = ({ userRole }: DashboardStatsProps) => {
  // Get metrics based on user role
  const userMetricsResult = useUserMetrics();
  const bankMetricsResult = useBankMetrics();
  const adminMetricsResult = useAdminMetrics();
  
  let metrics, isLoading, error, setMetrics;
  
  switch (userRole) {
    case "user":
      ({ metrics, isLoading, error, setMetrics } = userMetricsResult);
      break;
    case "bank":
      ({ metrics, isLoading, error, setMetrics } = bankMetricsResult);
      break;
    case "admin":
      ({ metrics, isLoading, error, setMetrics } = adminMetricsResult);
      break;
  }
  
  // Setup real-time updates
  useMetricsUpdates(userRole, metrics, setMetrics);
  
  // If there's an error, show error message
  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <p className="font-medium">Error loading metrics</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  return <MetricsGrid metrics={metrics} isLoading={isLoading} />;
};
